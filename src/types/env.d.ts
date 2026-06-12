declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Site
      NEXT_PUBLIC_SITE_URL: string;

      // Auth
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;

      // Database
      MONGODB_URI: string;

      // Cloudinary
      CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;

      // AI
      ANTHROPIC_API_KEY: string;

      // Maps
      GOOGLE_MAPS_API_KEY: string;
      NEXT_PUBLIC_GOOGLE_MAPS_PUBLIC_KEY: string;
    }
  }
}

export {};
