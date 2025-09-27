export interface Product {
    id?: number;
    title: string;
    slug: string;
    reference: string;
    category: string;
    short_description: string;
    long_description: string;
    image_url: string;
    specifications: any[];
    benefits: any[];
    downloads: any[];
    compatibility: string[];
    related_products: string[];
    is_new: boolean;
    featured: boolean;
    meta_title: string;
    meta_description: string;
}
export interface Slide {
    id?: number;
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    image_url: string;
    alt_text: string;
    order_index: number;
    is_active: boolean;
}
export interface Blog {
    id?: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url: string;
    author: string;
    status: 'draft' | 'published';
    meta_title: string;
    meta_description: string;
}
export interface Feature {
    id?: number;
    title: string;
    description: string;
    icon: string;
    icon_url: string;
    order_index: number;
    is_active: boolean;
}
export declare const requireAuth: (req: any, res: any, next: any) => any;
export declare const getProducts: (req: any, res: any) => Promise<void>;
export declare const getProduct: (req: any, res: any) => Promise<any>;
export declare const createProduct: (req: any, res: any) => Promise<void>;
export declare const updateProduct: (req: any, res: any) => Promise<void>;
export declare const deleteProduct: (req: any, res: any) => Promise<void>;
export declare const getSlides: (req: any, res: any) => Promise<void>;
export declare const createSlide: (req: any, res: any) => Promise<void>;
export declare const updateSlide: (req: any, res: any) => Promise<void>;
export declare const deleteSlide: (req: any, res: any) => Promise<void>;
export declare const getBlogs: (req: any, res: any) => Promise<void>;
export declare const createBlog: (req: any, res: any) => Promise<void>;
export declare const updateBlog: (req: any, res: any) => Promise<void>;
export declare const deleteBlog: (req: any, res: any) => Promise<void>;
export declare const getFeatures: (req: any, res: any) => Promise<void>;
export declare const createFeature: (req: any, res: any) => Promise<void>;
export declare const updateFeature: (req: any, res: any) => Promise<void>;
export declare const deleteFeature: (req: any, res: any) => Promise<void>;
export declare const getDashboardStats: (req: any, res: any) => Promise<void>;
//# sourceMappingURL=admin.d.ts.map