// Zone fees are placeholders. The real Laravel backend should own these rates.
export const ZONES = {
  A: { fee: 3500, days: [1, 3] },
  B: { fee: 5500, days: [3, 5] },
  C: { fee: 7500, days: [5, 7] },
};

const s = (name, zone, cities) => ({
  name,
  zone,
  cities: [...cities, "Other (add in address)"],
});

export const STATES = [
  s("FCT Abuja", "A", [
    "Abuja Municipal",
    "Gwagwalada",
    "Kuje",
    "Bwari",
    "Abaji",
  ]),
  s("Lagos", "A", [
    "Ikeja",
    "Lekki",
    "Victoria Island",
    "Surulere",
    "Yaba",
    "Ikorodu",
    "Ajah",
  ]),
  s("Ogun", "B", ["Abeokuta", "Ijebu Ode", "Sagamu"]),
  s("Oyo", "B", ["Ibadan", "Ogbomosho", "Oyo"]),
  s("Osun", "B", ["Osogbo", "Ile-Ife", "Ilesa"]),
  s("Ondo", "B", ["Akure", "Ondo", "Owo"]),
  s("Ekiti", "B", ["Ado-Ekiti", "Ikere"]),
  s("Edo", "B", ["Benin City", "Auchi", "Ekpoma"]),
  s("Delta", "B", ["Asaba", "Warri", "Sapele"]),
  s("Rivers", "B", ["Port Harcourt", "Obio-Akpor", "Bonny"]),
  s("Anambra", "B", ["Awka", "Onitsha", "Nnewi"]),
  s("Enugu", "B", ["Enugu", "Nsukka"]),
  s("Imo", "B", ["Owerri", "Orlu"]),
  s("Abia", "B", ["Umuahia", "Aba"]),
  s("Kaduna", "B", ["Kaduna", "Zaria"]),
  s("Nasarawa", "B", ["Lafia", "Karu", "Keffi"]),
  s("Niger", "B", ["Minna", "Suleja", "Bida"]),
  s("Kogi", "B", ["Lokoja", "Okene"]),
  s("Plateau", "B", ["Jos", "Bukuru"]),
  s("Kwara", "B", ["Ilorin", "Offa"]),
  s("Cross River", "B", ["Calabar", "Ogoja"]),
  s("Akwa Ibom", "B", ["Uyo", "Eket"]),
  s("Bayelsa", "B", ["Yenagoa"]),
  s("Ebonyi", "B", ["Abakaliki"]),
  s("Benue", "B", ["Makurdi", "Gboko"]),
  s("Kano", "C", ["Kano", "Wudil"]),
  s("Katsina", "C", ["Katsina", "Daura"]),
  s("Sokoto", "C", ["Sokoto"]),
  s("Kebbi", "C", ["Birnin Kebbi"]),
  s("Zamfara", "C", ["Gusau"]),
  s("Jigawa", "C", ["Dutse"]),
  s("Bauchi", "C", ["Bauchi"]),
  s("Gombe", "C", ["Gombe"]),
  s("Yobe", "C", ["Damaturu"]),
  s("Borno", "C", ["Maiduguri"]),
  s("Adamawa", "C", ["Yola"]),
  s("Taraba", "C", ["Jalingo"]),
].sort((a, b) => a.name.localeCompare(b.name));

export const findState = (name) =>
  STATES.find(
    (x) => x.name.toLowerCase() === String(name || "").toLowerCase(),
  ) || null;
