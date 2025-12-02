export default interface City {
    id: number;
    name: string;
    country: 'Morocco' | 'France';
    _count: {
        clients: number;
    };
}