export const mockDataProducts = [
    {
        "id": 391,
        "name": "Nivel láser",
        "slug": "nivel-laser",
        "description": "Autonivelante, 10 m",
        "picture": "https://dummyimage.com/300x300/000/fff.png&text=laser",
        "category_id": {
            "id": 30,
            "name": "Ferretería",
            "slug": "ferreteria"
        },
        "isActive": true,
        "createdAt": "2026-01-06T22:20:47.105Z",
        "updatedAt": "2026-01-06T22:20:47.105Z"
    },
    {
        "id": 390,
        "name": "Lija para madera",
        "slug": "lija-para-madera",
        "description": "Pack de 10, grano 80-240",
        "picture": "https://dummyimage.com/300x300/000/fff.png&text=lija",
        "category_id": {
            "id": 30,
            "name": "Ferretería",
            "slug": "ferreteria"
        },
        "isActive": true,
        "createdAt": "2026-01-06T22:20:47.105Z",
        "updatedAt": "2026-01-06T22:20:47.105Z"
    }
];
export const mockCategories = [
    { id: 2, name: 'Books', slug: 'books' },
    { id: 1, name: 'Electronics', slug: 'electronics' },
];
export const mockCategory={ id: 1, name: 'Books', slug: 'books' };
export const mockDataProduct = {
        id: 1,
        name: 'Same',
        slug: 'same',
        description: "Autonivelante, 10 m",
        picture: "https://dummyimage.com/300x300/000/fff.png&text=laser    ",
        category_id: mockCategory,
        isActive: true
      };
export const mockDataProductDuplicate = {
        id: 2, 
        name: 'New', slug: 'new',
        description: "Descripción con ñandú",
        picture: "https://dummyimage.com/300x300/000/fff.png&text=laser  ",
        category_id: 1,
        isActive: true
      };
export const mockDatadtoProduct = {
    name: 'Same',
        description: "Autonivelante, 10 m",
        picture: "https://dummyimage.com/300x300/000/fff.png&text=laser    ",
        category_id: 1, // ← coincide con mockCategory.id
        isActive: true
};
export const mockDtoCategory={name: 'Books', slug: 'books' };
