export interface Car {
  id: number;
  denumire_marca: string;
  denumire_model: string;
  an_fabricatie: number;
  capacitate_cilindrica: number;
  taxa_impozit: number;
}

export type CarPayload = Omit<Car, 'id'>;
