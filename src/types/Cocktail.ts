import { Categorie } from './Categorie';
import { Ingredient } from './Ingredient';
import { Variante } from './Variante';

export interface Cocktail {
    id: number
    libelle: string
    description: string
    image: string | null
    categorie: Categorie
    ingredients: Ingredient[]
    variantes: Variante[]
}