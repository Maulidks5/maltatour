export type TourCardData = {
    slug: string;
    title: string;
    description: string;
    duration: string;
    location: string;
    rating: number;
    reviewsCount: number;
    price: number;
    currency: string;
    image: string;
    category: string | null;
    experienceType: string;
    minimumAge: number | null;
    difficulty: string | null;
};

export type TourCategoryData = {
    name: string;
    slug: string;
    description: string | null;
    image: string;
    toursCount: number;
};

export type TourDetailData = TourCardData & {
    fullDescription: string;
    pickupDetails: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    highlights: string[];
    included: string[];
    notIncluded: string[];
    itinerary: Array<{
        time: string | null;
        title: string;
        description: string | null;
    }>;
    images: Array<{
        path: string;
        alt: string;
    }>;
};
