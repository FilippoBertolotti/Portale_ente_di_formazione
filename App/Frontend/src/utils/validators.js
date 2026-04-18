export const isCFValid = (v) => {
    if (!v?.trim()) return 'Codice fiscale obbligatorio';
    if (!/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i.test(v.trim()))
        return 'Codice fiscale non valido';
    return null;
};

export const isNameValid = (v) => {
    if (!v?.trim()) return 'Nome obbligatorio';
    if (v.trim().length < 2) return 'Nome troppo corto';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(v.trim())) return 'Caratteri non validi';
    return null;
};

export const isSurnameValid = (v) => {
    if (!v?.trim()) return 'Cognome obbligatorio';
    if (v.trim().length < 2) return 'Cognome troppo corto';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(v.trim())) return 'Caratteri non validi';
    return null;
};

export const isEmailValid = (v) => {
    if (!v?.trim()) return 'Email obbligatoria';
    if (!/\S+@\S+\.\S+/.test(v)) return 'Email non valida';
    return null;
};

export const isDateValid = (v) => {
    if (!v) return 'Data di nascita obbligatoria';
    const date = new Date(v);
    if (isNaN(date.getTime())) return 'Data non valida';
    if (date > new Date()) return 'La data non può essere nel futuro';
    const age = new Date().getFullYear() - date.getFullYear();
    if (age > 120) return 'Data non realistica';
    return null;
};

export const isCourseValid = (v) => {
    if (!v) return 'Seleziona un corso';
    return null;
};

export const isAcademicYearValid = (v) => {
    if (!v?.trim()) return 'Anno accademico obbligatorio';
    if (isNaN(parseInt(v.trim())) || parseInt(v.trim()) <= 0 || parseInt(v.trim()) > 2) return 'Inserisci un anno valido';
    return null;
};

export const isPhoneValid = (v) => {
    if (!v?.trim()) return 'Telefono obbligatorio';
    if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(v.trim())) return 'Telefono non valido';
    return null;
};

export const isQualificationValid = (v) => {
    if (!v?.trim()) return 'Qualifica obbligatorio';
    if (v.trim().length < 2) return 'Qualifica troppo corta';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(v.trim())) return 'Caratteri non validi';
    return null;
};

export const isPlaceNameValid = (v) => {
    if (!v?.trim()) return 'Nome del luogo obbligatorio';
    if (v.trim().length < 2) return 'Nome troppo corto (minimo 2 caratteri)';
    if (v.trim().length > 100) return 'Nome troppo lungo (massimo 100 caratteri)';
    return null;
};

export const isCapacityValid = (v) => {
    if (!v || v < 10) return 'Capacità non valida (minimo 10)';
    return null;
};

export const isSedeValid = (v) => {
    if (!v) return 'Seleziona una sede';
    return null;
};

export const isPianoValid = (v) => {
    if (!v?.trim()) return 'Piano obbligatorio';
    if (v.trim().length < 7) return 'Piano troppo corto';
    return null;
};

export const isAddressValid = (v, options = {}) => {
    if (!v?.trim()) return 'Indirizzo obbligatorio';
    if (v.trim().length < 5) return `Indirizzo troppo corto (minimo 5 caratteri)`;
    if (v.trim().length > 200) return `Indirizzo troppo lungo (massimo 200 caratteri)`;
    return null;
};

export const isCapValid = (v, required = true) => {
    if (!v?.trim()) return 'CAP obbligatorio';
    const cap = String(v).trim();
    if (!/^\d{5}$/.test(cap)) return 'CAP non valido (es. 20121)';
    return null;
};

export const isDescriptionValid = (v) => {
    if (!v?.trim()) return 'Descrizione obbligatoria';
    return null;
};

export const isCodeValid = (v) => {
    if (!v?.trim()) return 'Codice obbligatorio';
    if (v.trim().length < 4) return 'Codice troppo corto (minimo 4 caratteri)';
    if (v.trim().length > 15) return 'Codice troppo lungo (massimo 15 caratteri)';
    return null;
};

export const isYearValid = (v) => {
    if (!v?.trim()) return 'Anno obbligatorio';
    if (parseInt(v.trim()) < 2023) return 'Anno troppo passato (minimo 2023)';
    if (parseInt(v.trim()) > new Date().getFullYear() + 15) return 'Anno troppo futuro (massimo ' + (new Date().getFullYear() + 15) + ')';
    return null;
};

export const isCoordinatoreValid = (v) => {
    if (!v) return 'Seleziona un coordinatore';
    return null;
};

export const isProjectValid = (v) => {
    if (!v) return 'Seleziona un progetto';
    return null;
};

export const isColorValid = (v) => {
    if (!v?.trim()) return 'Colore obbligatorio';
    if (!/^#[0-9A-Fa-f]{6}$/.test(v.trim())) return 'Colore non valido (es. #EFA134)';
    return null;
};

export const isHoursValid = (v) => {
    if (!v?.trim()) return 'Ore obbligatorie';
    if (isNaN(parseInt(v.trim())) || parseInt(v.trim()) < 0) return 'Inserisci un numero di ore valido';
    return null;
};