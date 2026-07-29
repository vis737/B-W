"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const config_1 = require("../config");
const jsonDb_1 = require("../services/jsonDb");
const adminAuth_1 = require("../middleware/adminAuth");
const productFiltersSchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    age_group: zod_1.z.string().optional(),
    size: zod_1.z.string().optional(),
    color: zod_1.z.string().optional(),
    min_price: zod_1.z.coerce.number().optional(),
    max_price: zod_1.z.coerce.number().optional(),
    gender: zod_1.z.enum(['kids', 'men', 'unisex']).optional(),
    rating: zod_1.z.coerce.number().optional(),
    is_available: zod_1.z.preprocess((a) => a === 'true', zod_1.z.boolean()).optional(),
    is_new_arrival: zod_1.z.preprocess((a) => a === 'true', zod_1.z.boolean()).optional(),
    is_trending: zod_1.z.preprocess((a) => a === 'true', zod_1.z.boolean()).optional(),
    is_limited_edition: zod_1.z.preprocess((a) => a === 'true', zod_1.z.boolean()).optional(),
    on_sale: zod_1.z.preprocess((a) => a === 'true', zod_1.z.boolean()).optional(),
    search: zod_1.z.string().optional(),
    sort_by: zod_1.z.enum(['newest', 'popularity', 'price_asc', 'price_desc', 'rating', 'best_selling']).optional(),
    page: zod_1.z.coerce.number().default(1),
    per_page: zod_1.z.coerce.number().default(12),
});
const productInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    slug: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    short_description: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    base_price: zod_1.z.coerce.number().nonnegative(),
    discount_price: zod_1.z.coerce.number().nonnegative().optional(),
    currency: zod_1.z.string().default('USD'),
    gender: zod_1.z.enum(['kids', 'men', 'unisex']).default('men'),
    category_slug: zod_1.z.string().optional(),
    image_url: zod_1.z.string().optional(),
    brand: zod_1.z.string().default('Black & White Atelier'),
    fit_guide: zod_1.z.string().optional(),
    fabric_info: zod_1.z.string().optional(),
    wash_care: zod_1.z.string().optional(),
    return_policy: zod_1.z.string().optional(),
    fit_type: zod_1.z.string().optional(),
    material: zod_1.z.string().optional(),
    is_active: zod_1.z.boolean().default(true),
    is_featured: zod_1.z.boolean().default(false),
    is_new_arrival: zod_1.z.boolean().default(false),
    is_trending: zod_1.z.boolean().default(false),
    is_limited_edition: zod_1.z.boolean().default(false),
});
exports.router = (0, express_1.Router)();
function primaryImage(product) {
    return product.images.find((image) => image.is_primary) ?? product.images[0];
}
function toListItem(product) {
    return {
        ...product,
        primary_image_url: primaryImage(product)?.url ?? null,
    };
}
function filterLocalProducts(products, filters) {
    let rows = products.filter((product) => product.is_active);
    if (filters.min_price !== undefined)
        rows = rows.filter((product) => product.base_price >= filters.min_price);
    if (filters.max_price !== undefined)
        rows = rows.filter((product) => product.base_price <= filters.max_price);
    if (filters.gender)
        rows = rows.filter((product) => product.gender === filters.gender);
    if (filters.category)
        rows = rows.filter((product) => product.categories.some((category) => category.slug === filters.category || category.id === filters.category));
    if (filters.age_group)
        rows = rows.filter((product) => product.age_groups.some((ageGroup) => ageGroup.slug === filters.age_group || ageGroup.id === filters.age_group));
    if (filters.size)
        rows = rows.filter((product) => product.variants.some((variant) => variant.size?.toLowerCase() === filters.size.toLowerCase()));
    if (filters.color)
        rows = rows.filter((product) => product.variants.some((variant) => variant.color?.toLowerCase().includes(filters.color.toLowerCase())));
    if (filters.is_new_arrival)
        rows = rows.filter((product) => product.is_new_arrival);
    if (filters.is_trending)
        rows = rows.filter((product) => product.is_trending);
    if (filters.is_limited_edition)
        rows = rows.filter((product) => product.is_limited_edition);
    if (filters.on_sale)
        rows = rows.filter((product) => product.discount_price !== undefined);
    if (filters.rating !== undefined)
        rows = rows.filter((product) => (product.average_rating ?? 0) >= filters.rating);
    if (filters.search) {
        const term = filters.search.toLowerCase();
        rows = rows.filter((product) => [product.name, product.description, product.short_description, product.brand, product.material]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(term)));
    }
    switch (filters.sort_by) {
        case 'price_asc':
            rows.sort((a, b) => a.base_price - b.base_price);
            break;
        case 'price_desc':
            rows.sort((a, b) => b.base_price - a.base_price);
            break;
        case 'rating':
            rows.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
            break;
        case 'popularity':
        case 'best_selling':
            rows.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0));
            break;
        case 'newest':
        default:
            rows.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
            break;
    }
    return rows;
}
async function getSupabaseProducts(filters) {
    if (!config_1.supabase)
        return null;
    let query = config_1.supabase
        .from('products')
        .select(`id, name, slug, sku, base_price, discount_price, currency, gender,
       is_active, is_featured, is_new_arrival, is_trending,
       is_limited_edition, created_at, updated_at, brand,
       product_images(url, is_primary)`, { count: 'exact' })
        .eq('is_active', true);
    if (filters.min_price !== undefined)
        query = query.gte('base_price', filters.min_price);
    if (filters.max_price !== undefined)
        query = query.lte('base_price', filters.max_price);
    if (filters.gender)
        query = query.eq('gender', filters.gender);
    if (filters.is_new_arrival)
        query = query.eq('is_new_arrival', true);
    if (filters.is_trending)
        query = query.eq('is_trending', true);
    if (filters.is_limited_edition)
        query = query.eq('is_limited_edition', true);
    if (filters.search) {
        const term = `%${filters.search}%`;
        query = query.or(`name.ilike.${term},description.ilike.${term}`);
    }
    switch (filters.sort_by) {
        case 'price_asc':
            query = query.order('base_price', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('base_price', { ascending: false });
            break;
        default:
            query = query.order('created_at', { ascending: false });
    }
    const from = (filters.page - 1) * filters.per_page;
    const { data, error, count } = await query.range(from, from + filters.per_page - 1);
    if (error) {
        console.warn('Supabase products query failed, falling back to JSON store:', error.message);
        return null;
    }
    return {
        items: (data ?? []).map((row) => {
            const primary = (row.product_images ?? []).find((image) => image.is_primary) ?? row.product_images?.[0];
            return { ...row, primary_image_url: primary?.url ?? null };
        }),
        total: count ?? 0,
    };
}
exports.router.get('/', async (req, res) => {
    const parseResult = productFiltersSchema.safeParse(req.query);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid query parameters', details: parseResult.error.errors });
    }
    const filters = parseResult.data;
    const supabaseResult = await getSupabaseProducts(filters);
    if (supabaseResult) {
        return res.json({
            items: supabaseResult.items,
            pagination: {
                page: filters.page,
                per_page: filters.per_page,
                total: supabaseResult.total,
                total_pages: Math.ceil(supabaseResult.total / filters.per_page),
            },
        });
    }
    const filtered = filterLocalProducts((0, jsonDb_1.listProducts)(), filters);
    const from = (filters.page - 1) * filters.per_page;
    const items = filtered.slice(from, from + filters.per_page).map(toListItem);
    return res.json({
        items,
        pagination: {
            page: filters.page,
            per_page: filters.per_page,
            total: filtered.length,
            total_pages: Math.ceil(filtered.length / filters.per_page),
        },
    });
});
exports.router.get('/meta/categories', (_req, res) => {
    res.json((0, jsonDb_1.listCategories)().filter((category) => category.is_active));
});
exports.router.get('/meta/age-groups', (_req, res) => {
    res.json((0, jsonDb_1.listAgeGroups)().filter((ageGroup) => ageGroup.is_active));
});
exports.router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    if (config_1.supabase) {
        const { data, error } = await config_1.supabase
            .from('products')
            .select(`*, product_images(*), product_variants(*),
       product_categories(category_id, categories(id, name, slug)),
       product_age_groups(age_group_id, age_groups(id, name, min_months, max_months))`)
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
        if (!error && data)
            return res.json(data);
    }
    const product = (0, jsonDb_1.listProducts)().find((item) => item.slug === slug || item.id === slug);
    if (!product || !product.is_active) {
        return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(product);
});
exports.router.post('/', adminAuth_1.verifyAdminToken, (req, res) => {
    const parseResult = productInputSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({ error: 'Invalid product payload', details: parseResult.error.errors });
    }
    const data = parseResult.data;
    const products = (0, jsonDb_1.listProducts)();
    const categories = (0, jsonDb_1.listCategories)();
    const category = categories.find((item) => item.slug === data.category_slug) ?? categories[0];
    const id = `p-${Date.now()}`;
    const slug = data.slug ? (0, jsonDb_1.slugify)(data.slug) : (0, jsonDb_1.slugify)(data.name);
    if (products.some((product) => product.slug === slug)) {
        return res.status(409).json({ error: 'A product with this slug already exists.' });
    }
    const product = {
        id,
        name: data.name,
        slug,
        sku: data.sku || `BW-${Date.now()}`,
        short_description: data.short_description,
        description: data.description,
        base_price: data.base_price,
        discount_price: data.discount_price,
        currency: data.currency,
        gender: data.gender,
        categories: [category],
        age_groups: [(0, jsonDb_1.listAgeGroups)()[2]],
        images: [
            {
                id: `img-${id}`,
                product_id: id,
                url: data.image_url || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop',
                alt_text: data.name,
                sort_order: 1,
                is_primary: true,
            },
        ],
        variants: [],
        brand: data.brand,
        fit_guide: data.fit_guide,
        fabric_info: data.fabric_info,
        wash_care: data.wash_care,
        return_policy: data.return_policy,
        fit_type: data.fit_type,
        material: data.material,
        is_active: data.is_active,
        is_featured: data.is_featured,
        is_new_arrival: data.is_new_arrival,
        is_trending: data.is_trending,
        is_limited_edition: data.is_limited_edition,
        average_rating: 0,
        review_count: 0,
        created_at: (0, jsonDb_1.nowIso)(),
        updated_at: (0, jsonDb_1.nowIso)(),
    };
    products.unshift(product);
    (0, jsonDb_1.writeProducts)(products);
    return res.status(201).json({ product });
});
exports.router.put('/:id', adminAuth_1.verifyAdminToken, (req, res) => {
    const products = (0, jsonDb_1.listProducts)();
    const index = products.findIndex((product) => product.id === req.params.id || product.slug === req.params.id);
    if (index < 0)
        return res.status(404).json({ error: 'Product not found' });
    const updated = {
        ...products[index],
        ...req.body,
        updated_at: (0, jsonDb_1.nowIso)(),
    };
    products[index] = updated;
    (0, jsonDb_1.writeProducts)(products);
    return res.json({ product: updated });
});
exports.router.delete('/:id', adminAuth_1.verifyAdminToken, (req, res) => {
    const products = (0, jsonDb_1.listProducts)();
    const product = products.find((item) => item.id === req.params.id || item.slug === req.params.id);
    if (!product)
        return res.status(404).json({ error: 'Product not found' });
    product.is_active = false;
    product.updated_at = (0, jsonDb_1.nowIso)();
    (0, jsonDb_1.writeProducts)(products);
    return res.json({ success: true, product });
});
