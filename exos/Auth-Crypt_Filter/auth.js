function generateToken(user) {
    const jsonString = JSON.stringify(user);
    return btoa(jsonString); 
}


function verifyToken(token) {
    const jsonString = atob(token); 
    return JSON.parse(jsonString);
}



const user = { id: 1, username: 'Toto', role: 'admin' };
const token = generateToken(user);
console.log('Token:', token);


const decodedUser = verifyToken(token);
console.log('Utilisateur décodé:', decodedUser);        