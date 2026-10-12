export interface Trip {
    _id: string, // Internal primary key in MongoDB
    code: string,
    name: string,
    length: string,
    start: Date,
    resort: string,
    perPerson: string,
    image: string,
    description: string,
    rating: number | null // Rating from 1 to 5 stars
}