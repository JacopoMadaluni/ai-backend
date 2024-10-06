export type StoreType = "basic" | "furnished" | "italian";

export type Store = {
	name: string;
	type: StoreType;
};

export type Ingredient = {
	name: string;
	type: StoreType;
};

export type Recipe = {
	name: string;
	difficulty: "easy" | "medium" | "hard";
	messiness: "low" | "medium" | "high";
	ingredients: string[];
};

export type State = {
	stores: Store[];
	ingredients: Ingredient[];
	recipes: Recipe[];

	days: {
		monday: Recipe[];
		tuesday: Recipe[];
		wednesday: Recipe[];
		thursday: Recipe[];
		friday: Recipe[];
		saturday: Recipe[];
		sunday: Recipe[];
	};
};
