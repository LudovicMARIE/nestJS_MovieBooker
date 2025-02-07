const articles = [
    { id: 1, title: 'Laptop', price: 1500 },
    { id: 2, title: 'Phone', price: 800 },
    { id: 3, title: 'Tablet', price: 600 },
    { id: 4, title: 'Headphones', price: 200 }
];


function filterArray(array, criteria) {
    return array.filter(item => {
        return Object.keys(criteria).every(key => item[key] >= criteria[key]);
    });
}

const filteredArticles = filterArray(articles, { price: 700 });
console.log('Articles filtrés:', filteredArticles);
