export interface Food {
    _id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    rating?: number;
    chef?: { name: string };
    bespokeOption?: string;
    tags: string[];
    bespokeNote?: string;
  }