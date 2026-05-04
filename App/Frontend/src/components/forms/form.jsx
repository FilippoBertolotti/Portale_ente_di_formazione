import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Input from '../common/input';
import Select from '../common/select';

const Form = forwardRef(({
    onSubmit,
    loading,
    error,
    fields = [],       // ['email', 'password']
    labels = [],       // ['Email', 'Password']
    types = [],        // ['text', 'password']
    placeholders = [], // ['mario@example.com', '••••••••']
    validators = {},   // { email: (v) => !v ? 'Obbligatorio' : null, ... }
    options = {},   // { nomecampo: [{ value: '...', label: '...' }] }
    layout = null,  // [['email'], ['password', 'confirmPassword']]
    defaultValues = {}  // { email: ' ', ... }    
}, ref) => {

    //Inizializza formData dinamicamente dai fields ricevuti
    const [formData, setFormData] = useState(() => {
        const initialData = {};
        fields.forEach((field, index) => {
            // PRIORITÀ:
            // 1. Se c'è un defaultValues specifico per questo campo, usalo
            // 2. Se il campo ha opzioni (select), usa il primo valore disponibile
            // 3. Altrimenti stringa vuota
            
            if (defaultValues[field] !== undefined) {
                // Valore passato esplicitamente (per modifica)
                initialData[field] = defaultValues[field];
            } else {
                const fieldOptions = options[field];
                // Se il campo ha opzioni, imposta il primo valore come default
                if (fieldOptions && fieldOptions.length > 0 && !placeholders[index]) {
                    const firstValue = fieldOptions[0].value;
                    initialData[field] = firstValue;
                } else {
                    initialData[field] = '';
                }
            }
        });
        return initialData;
    });

    const [errors, setErrors] = useState({});

    useImperativeHandle(ref, () => ({
        submit: () => handleSubmit()
    }));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Pulisce l'errore del campo non appena l'utente scrive
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSelectChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach((field, i) => {
            // Array → usa l'indice
            const validator = validators[i];

            if (validator) {
                const message = validator(formData[field], formData);
                if (message) newErrors[field] = message;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        if (e?.preventDefault) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (validate()) {
            onSubmit(formData);
        }
    };

    // aggiorna formData se cambiano defaultValues (es. carica dati diversi)
    // Utile quando si modifica un record diverso nella stessa sessione
    useState(() => {
        const newData = {};
        fields.forEach((field, index) => {
            if (defaultValues[field] !== undefined) {
                newData[field] = defaultValues[field];
            } else {
                const fieldOptions = options[field];
                if (fieldOptions && fieldOptions.length > 0 && !placeholders[index]) {
                    newData[field] = fieldOptions[0].value;
                } else {
                    newData[field] = '';
                }
            }
        });
        
        setFormData(newData);
        setErrors({}); // Pulisci errori quando cambiano i dati
    }, [defaultValues, fields, options, placeholders]);

    return (
        <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleSubmit}
            noValidate
        >
            {(layout ?? fields.map(f => [f])).map((row, rowIndex) => (
                <div key={rowIndex} className={`grid gap-[1vw] grid-cols-${row.length}`}>
                    {row.map((field) => {
                        const i = fields.indexOf(field);
                        const fieldOptions = options[field];

                        if (fieldOptions) {
                            return (
                                <div key={field} className="flex flex-col gap-1">
                                    <Select
                                        title={labels[i] ?? field}
                                        placeholder={placeholders[i]}
                                        options={fieldOptions}
                                        value={formData[field]}
                                        error={errors[field]}
                                        onChange={(value) => handleSelectChange(field, value)}
                                        classNameLa="text-[#777777]"
                                    />
                                    <span className="text-red-500 text-sm ml-[30px]">
                                        {errors[field] ?? '\u00A0'}
                                    </span>
                                </div>
                            );
                        }

                        if (types[i] === 'color') {
                            return (
                                <div key={field} className="flex flex-col gap-2 w-full">
                                    <label className="text-sm text-[#777777] font-bold ml-[30px]">
                                        {labels[i] ?? field}
                                    </label>
                                    <div className="flex items-center gap-[1vw] border border-[#E0E6EB] rounded-[30px] px-4 py-2">
                                        <input
                                            type="color"
                                            name={field}
                                            value={formData[field] || '#EFA134'}
                                            onChange={handleChange}
                                            className="w-8 h-8 rounded-[30px] cursor-pointer border-none bg-transparent"
                                        />
                                        <span className="text-base font-bold text-black">
                                            {formData[field] || '#EFA134'}
                                        </span>
                                    </div>
                                    <span className="text-red-500 text-sm ml-[30px]">
                                        {errors[field] ?? '\u00A0'}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <Input
                                key={field}
                                label={labels[i] ?? field}
                                type={types[i] ?? 'text'}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                placeholder={placeholders[i] ?? ''}
                                error={errors[field]}
                                disabled={loading}
                                classNameLa="text-[#777777] font-bold ml-[30px]"
                                classNameEr="ml-[30px]"
                            />
                        );
                    })}
                </div>
            ))}
            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md
                                border-l-4 border-red-500 text-sm">
                    {error}
                </div>
            )}
        </form>
    );
});

Form.displayName = 'Form';
export default Form;