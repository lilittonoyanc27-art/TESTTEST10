/**
 * Utility to translate numbers 1 to 3000 into Spanish, Armenian phonetics, and Armenian translations.
 */

export function numberToSpanish(n: number): string {
  if (n === 0) return 'cero';
  if (n < 0 || n > 3000) return '';

  const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const twenties = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  const tens = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const hundredsReg = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

  let result = '';

  // Thousands
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    if (t === 1) {
      result += 'mil';
    } else if (t === 2) {
      result += 'dos mil';
    } else if (t === 3) {
      result += 'tres mil';
    }
    n = n % 1000;
    if (n > 0) result += ' ';
  }

  // Hundreds
  if (n >= 100) {
    if (n === 100) {
      result += 'cien';
      n = 0;
    } else {
      const h = Math.floor(n / 100);
      result += hundredsReg[h];
      n = n % 100;
      if (n > 0) result += ' ';
    }
  }

  // Tens and Units
  if (n > 0) {
    if (n < 10) {
      result += units[n];
    } else if (n >= 10 && n < 20) {
      result += teens[n - 10];
    } else if (n >= 20 && n < 30) {
      result += twenties[n - 20];
    } else {
      const t = Math.floor(n / 10);
      const u = n % 10;
      if (u === 0) {
        result += tens[t];
      } else {
        result += tens[t] + ' y ' + units[u];
      }
    }
  }

  return result.trim();
}

/**
 * Maps Spanish words to phonetic Armenian letters
 */
const spanishToArmPhoneticMap: Record<string, string> = {
  cero: 'սերո',
  uno: 'ունո',
  dos: 'դոս',
  tres: 'տրես',
  cuatro: 'կուատրո',
  cinco: 'սինկո',
  seis: 'սեյս',
  siete: 'սիետե',
  ocho: 'ոչո',
  nueve: 'նուևե',
  diez: 'դիես',
  once: 'ոնսե',
  doce: 'դոսե',
  trece: 'տրեսե',
  catorce: 'կատորսե',
  quince: 'կինսե',
  dieciséis: 'դիեսիսեյս',
  diecisiete: 'դիեսիսիետե',
  dieciocho: 'դիեսիոչո',
  diecinueve: 'դիեսինուևե',
  veinte: 'վեյնտե',
  veintiuno: 'վեյնտիունո',
  veintidós: 'վեյնտիդոս',
  veintitrés: 'վեյնտիտրես',
  veinticuatro: 'վեյնտիկուատրո',
  veinticinco: 'վեյնտիսինկո',
  veintiséis: 'վեյնտիսեյս',
  veintisiete: 'վեյնտիսիետե',
  veintiocho: 'վեյնտիոչո',
  veintinueve: 'վեյնտինուևե',
  treinta: 'տրեյնտա',
  cuarenta: 'կուարենտա',
  cincuenta: 'սինկուենտա',
  sesenta: 'սեսենտա',
  setenta: 'սետենտա',
  ochenta: 'ոչենտա',
  noventa: 'նովենտա',
  cien: 'սիեն',
  ciento: 'սիենտո',
  doscientos: 'դոսսիենտոս',
  trescientos: 'տրեսսիենտոս',
  cuatrocientos: 'կուատրոսիենտոս',
  quinientos: 'կինիենտոս',
  seiscientos: 'սեյսսիենտոս',
  setecientos: 'սետեսիենտոս',
  ochocientos: 'ոչոսիենտոս',
  novecientos: 'նովեսիենտոս',
  mil: 'միլ',
  y: 'ի'
};

export function numberToArmPhonetic(n: number): string {
  const spanish = numberToSpanish(n);
  if (!spanish) return '';

  const words = spanish.split(/\s+/);
  const armWords = words.map(word => {
    const normalized = word.toLowerCase();
    return spanishToArmPhoneticMap[normalized] || word;
  });

  return armWords.join(' ');
}

export function numberToArm(n: number): string {
  if (n === 0) return 'զրո';
  if (n < 0 || n > 3000) return '';

  const units = ['', 'մեկ', 'երկու', 'երեք', 'չորս', 'հինգ', 'վեց', 'յոթ', 'ութ', 'ինը'];
  const tens = ['', 'տասն', 'քսան', 'երեսուն', 'քառասուն', 'հիսուն', 'վաթսուն', 'յոթանասուն', 'ութսուն', 'իննսուն'];

  let result = '';

  // Thousands
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    if (t === 1) {
      result += 'հազար';
    } else {
      result += units[t] + ' հազար';
    }
    n = n % 1000;
    if (n > 0) result += ' ';
  }

  // Hundreds
  if (n >= 100) {
    const h = Math.floor(n / 100);
    if (h === 1) {
      result += 'հարյուր';
    } else {
      result += units[h] + ' հարյուր';
    }
    n = n % 100;
    if (n > 0) result += ' ';
  }

  // Tens and Units
  if (n > 0) {
    if (n < 10) {
      result += units[n];
    } else {
      const t = Math.floor(n / 10);
      const u = n % 10;
      
      let tenPart = tens[t];
      if (t === 1) {
        // Handle ten combination as 'տասնմեկ', 'տասներկու', etc.
        if (u === 0) {
          result += 'տասը';
        } else {
          result += 'տասն' + units[u];
        }
      } else {
        if (u === 0) {
          result += tenPart;
        } else {
          result += tenPart + units[u]; // e.g. 'քսանմեկ'
        }
      }
    }
  }

  return result.trim();
}
