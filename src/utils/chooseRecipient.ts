export interface Admin {
    _id: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
}
 
export const Admins: Admin[] = [
    {
        '_id': '67a5c405f41bb154af169939',
        'role': '',
        'email': '',
        'firstName': 'Zamir',
        'lastName': 'Baitishchev'
    },
];

export const chooseRandomAdmin = (): Admin | null => {
    if (Admins.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * Admins.length);
    return Admins[randomIndex];
};

export const getAdmin = (): Admin | null => {
    const admin = chooseRandomAdmin();
    if (admin) {
        console.log(`   Chat started with ${admin.firstName} ${admin.lastName} (${admin.email})`);
        return admin;
    } else {
        console.log('No admins available.');
        return null;
    }
};
