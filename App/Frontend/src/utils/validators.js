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