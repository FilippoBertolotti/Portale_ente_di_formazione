import { forwardRef, useImperativeHandle, useState } from 'react';
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
}, ref) => {

    // Inizializza formData dinamicamente dai fields ricevuti
    const [formData, setFormData] = useState(() =>
        Object.fromEntries(fields.map(field => [field, '']))
    );
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

    const validate = () => {
        const newErrors = {};
        fields.forEach((field, i) => {
            // Array → usa l'indice  |  Oggetto → usa il nome del campo
            const validator = Array.isArray(validators)
                ? validators[i]
                : validators[field];

            if (validator) {
                const message = validator(formData[field]);
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

    return (
        <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleSubmit}
            noValidate
        >
            {fields.map((field, i) => {
                const fieldOptions = options[field];

                // Se esistono opzioni per questo campo → Select
                if (fieldOptions) {
                    return (
                        <div key={field} className="flex flex-col gap-1">
                            <Select
                                title={labels[i] ?? field}
                                placeholder={placeholders[i] ?? 'Seleziona...'}
                                options={fieldOptions}
                                value={formData[field]}
                                onChange={(value) => handleSelectChange(field, value)}
                            />
                            {/* Errore sotto il select, allineato come gli Input */}
                            <span className="text-red-500 text-sm ml-[30px]">
                                {errors[field] ?? '\u00A0'}
                            </span>
                        </div>
                    );
                }

                // Altrimenti → Input normale
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
                        required
                        disabled={loading}
                        classNameLa="text-[#777777] font-bold ml-[30px]"
                        classNameEr="ml-[30px]"
                    />
                );
            })}
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