export const colors = {
    black1: "#09090b",
    blue1: '#22d3ee',
    darkGrey: "#171717",
    lightText: '#d4d4d4',
    lightGrey: "#9ca3af",
    fail: "#ef4444",
    success: "#22c55e"
}

export const genders = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
];

export const smokingHabits = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];

export const alcoholConsumption = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
];

export const langs = [
    { label: 'English', value: 'English' },
    { label: 'Urdu', value: 'Urdu' },
    { label: 'Spanish', value: 'Spanish' },
];

export const ageOptions = Array.from({ length: 83 }, (_, i) => ({
    label: `${i + 18}`,
    value: `${i + 18}`,
}));

export const cities = [
    { label: 'Karachi', value: 'Karachi' },
    { label: 'Lahore', value: 'Lahore' },
    { label: 'Islamabad', value: 'Islamabad' },
]

export const sleepQuality = [
    { label: 'Good', value: 'Good' },
    { label: 'Average', value: 'Average' },
    { label: 'Poor', value: 'Poor' },]

export const availableTags = [
    { label: 'Lose Weight', value: 'Lose Weight' },
    { label: 'Control Blood Pressure', value: 'Control Blood Pressure' },
    { label: 'Improve Sleep Quality', value: 'Improve Sleep Quality' },
    { label: 'Eat Healthy', value: 'Eat Healthy' },
    { label: 'Reduce Stress', value: 'Reduce Stress' },
    { label: 'Stay Hydrated', value: 'Stay Hydrated' },
    { label: 'Build Muscle', value: 'Build Muscle' },
    { label: 'Quit Smoking', value: 'Quit Smoking' },
    { label: 'Reduce Alcohol Intake', value: 'Reduce Alcohol' },
    { label: 'Manage Medication', value: 'Manage Medication' },
    { label: 'Boost Energy', value: 'Boost Energy' },
    { label: 'Improve Mental Health', value: 'Mental Health' },
    { label: 'Enhance Focus', value: 'Enhance Focus' },
    { label: 'Improve Digestion', value: 'Digestion' },
    { label: 'Control Blood Sugar', value: 'Blood Sugar' },
    { label: 'Monitor Vitals', value: 'Monitor Vitals' },
    { label: 'Be More Active', value: 'Be Active' },
    { label: 'Improve Skin Health', value: 'Skin Health' },
];
