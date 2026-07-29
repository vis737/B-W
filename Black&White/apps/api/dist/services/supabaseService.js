"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncClerkUserToSupabase = syncClerkUserToSupabase;
exports.fetchProductsFromSupabase = fetchProductsFromSupabase;
exports.saveProductToSupabase = saveProductToSupabase;
exports.fetchCategoriesFromSupabase = fetchCategoriesFromSupabase;
exports.saveOrderToSupabase = saveOrderToSupabase;
exports.fetchOrdersFromSupabase = fetchOrdersFromSupabase;
exports.saveBankReceiptToSupabase = saveBankReceiptToSupabase;
exports.saveNewsletterSubscriberToSupabase = saveNewsletterSubscriberToSupabase;
// apps/api/src/services/supabaseService.ts
const config_1 = require("../config");
async function syncClerkUserToSupabase(user) {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase
            .from('users')
            .upsert({
            clerk_id: user.clerk_id,
            email: user.email,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            avatar_url: user.avatar_url || '',
            membership_tier: user.membership_tier || 'silver',
            customer_id: user.customer_id || `BW-CUST-${user.clerk_id.slice(-6).toUpperCase()}`,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'clerk_id' })
            .select()
            .single();
        if (error) {
            console.error('[Supabase] Error upserting user:', error.message);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] User sync exception:', err);
        return null;
    }
}
async function fetchProductsFromSupabase() {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase
            .from('products')
            .select('*, images:product_images(*), variants:product_variants(*)');
        if (error) {
            console.error('[Supabase] Error fetching products:', error.message);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] Products exception:', err);
        return null;
    }
}
async function saveProductToSupabase(product) {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase
            .from('products')
            .upsert({
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: product.sku,
            short_description: product.short_description,
            description: product.description,
            base_price: product.base_price,
            discount_price: product.discount_price,
            currency: product.currency || 'USD',
            gender: product.gender,
            brand: product.brand,
            fit_guide: product.fit_guide,
            fabric_info: product.fabric_info,
            wash_care: product.wash_care,
            return_policy: product.return_policy,
            is_active: product.is_active ?? true,
            is_featured: product.is_featured ?? false,
            is_new_arrival: product.is_new_arrival ?? false,
            is_trending: product.is_trending ?? false,
            is_limited_edition: product.is_limited_edition ?? false,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'slug' })
            .select()
            .single();
        if (error) {
            console.error('[Supabase] Error saving product:', error.message);
            return null;
        }
        if (product.images && product.images.length > 0 && data?.id) {
            await config_1.supabase.from('product_images').delete().eq('product_id', data.id);
            await config_1.supabase.from('product_images').insert(product.images.map((img) => ({
                product_id: data.id,
                url: img.url,
                alt_text: img.alt_text || product.name,
                sort_order: img.sort_order || 0,
                is_primary: img.is_primary || false,
            })));
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] Save product exception:', err);
        return null;
    }
}
async function fetchCategoriesFromSupabase() {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase.from('categories').select('*');
        if (error) {
            console.error('[Supabase] Error fetching categories:', error.message);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] Categories exception:', err);
        return null;
    }
}
async function saveOrderToSupabase(order, items) {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data: orderData, error: orderErr } = await config_1.supabase
            .from('orders')
            .upsert({
            id: order.id,
            customer_id: order.customer_id,
            order_number: order.order_number,
            subtotal: order.subtotal,
            shipping_cost: order.shipping_cost,
            discount_amount: order.discount_amount,
            tax_amount: order.tax_amount,
            total: order.total,
            currency: order.currency || 'USD',
            status: order.status || 'pending',
            payment_method: order.payment_method || 'bank_transfer',
            payment_status: order.payment_status || 'pending',
            shipping_address: order.shipping_address,
            customer_info: order.customer_info,
            gift_wrapping: order.gift_wrapping || false,
            gift_message: order.gift_message,
            notes: order.notes,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'order_number' })
            .select()
            .single();
        if (orderErr) {
            console.error('[Supabase] Error inserting order:', orderErr.message);
            return null;
        }
        if (items && items.length > 0 && orderData?.id) {
            await config_1.supabase.from('order_items').delete().eq('order_id', orderData.id);
            await config_1.supabase.from('order_items').insert(items.map((item) => ({
                order_id: orderData.id,
                product_id: item.product_id,
                variant_id: item.variant_id,
                product_name: item.product_name,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price || item.unit_price * item.quantity,
            })));
        }
        return orderData;
    }
    catch (err) {
        console.error('[Supabase] Save order exception:', err);
        return null;
    }
}
async function fetchOrdersFromSupabase() {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase.from('orders').select('*, items:order_items(*)');
        if (error) {
            console.error('[Supabase] Error fetching orders:', error.message);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] Orders exception:', err);
        return null;
    }
}
async function saveBankReceiptToSupabase(receipt) {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase.from('bank_transfer_receipts').insert([receipt]).select().single();
        if (error) {
            console.error('[Supabase] Error inserting bank receipt:', error.message);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] Bank receipt exception:', err);
        return null;
    }
}
async function saveNewsletterSubscriberToSupabase(email) {
    if (!config_1.isSupabaseConfigured || !config_1.supabase)
        return null;
    try {
        const { data, error } = await config_1.supabase
            .from('newsletter_subscribers')
            .upsert({ email, status: 'subscribed' }, { onConflict: 'email' })
            .select()
            .single();
        if (error) {
            console.error('[Supabase] Error saving newsletter subscriber:', error.message);
            return null;
        }
        return data;
    }
    catch (err) {
        console.error('[Supabase] Newsletter subscriber exception:', err);
        return null;
    }
}
