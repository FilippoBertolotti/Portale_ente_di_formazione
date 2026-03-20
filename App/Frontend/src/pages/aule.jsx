import { useState, useEffect } from 'react';
import { progettiService } from '../services/progettiService';
import { docentiService } from '../services/docentiService';
import Loader from '../components/common/Loader';
import Header from '../components/common/header';
import { useAuth } from '../hooks/useAuth';
import Container from '../components/common/container';
import Button from '../components/common/button';
import SvgIcon from '../assets/icons/svgIcon';
import Table from '../components/common/table';
import SelectFilter from '../components/common/selectFilter';
// import Input from '../components/common/input';
import { moduliService } from '../services/moduliService';

const CorsoModuloCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false);
    const values = value.split('\n');
    const limit = expanded ? values.length : 2;
    const items = [];
    for (let i = 0; i < limit; i += 2) {
        items.push(
            <div key={i} className='flex flex-col w-full py-[0.5vh]'>
                <div className="font-bold"><span className="text-sm font-normal whitespace-nowrap">Corso: </span>{values[i]}</div>
                <div className="font-bold"><span className="text-sm font-normal whitespace-nowrap">Modulo: </span>{values[i + 1]}</div>
            </div>
        );
    }
    return (
        <div className='flex flex-col w-full'>
            {items}
            {values.length > 2 && (
                <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    className="text-xs text-[#2B7BB4] hover:underline mt-[0.5vh] text-left"
                >
                    {expanded ? 'Mostra meno' : `Vedi altri ${(values.length / 2) - 1}`}
                </button>
            )}
        </div>
    );
};

const Aule = () => {
    const { user } = useAuth();
    const [progetti, setProgetti] = useState([]);
    const [anni, setAnni] = useState([]);
    const [docenti, setDocenti] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProgetto, setSelectedProgetto] = useState(null);
    const [selectedAnno, setSelectedAnno] = useState(null);
    // const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProgetti = async () => {
            try {
                setLoading(true);
                const response = await progettiService.getAll(); selectedAnno ? await progettiService.getByCodiceAnno(selectedProgetto, selectedAnno) :

                    console.log('📦 Risposta API:', response);

                let progettiData = [];

                if (Array.isArray(response)) {
                    progettiData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    progettiData = response.data;
                } else if (response?.progetti && Array.isArray(response.progetti)) {
                    progettiData = response.progetti;
                } else if (response?.results && Array.isArray(response.results)) {
                    progettiData = response.results;
                } else {
                    console.warn('Formato dati non riconosciuto:', response);
                    progettiData = [];
                }

                setProgetti(progettiData);
                setError('');

            } catch (err) {
                setError('Errore nel caricamento dei progetti');
                console.error('❌ Errore fetch:', err);
                setProgetti([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchAnni = async () => {
            try {
                setLoading(true);
                const response = await moduliService.getAnni();

                console.log('📦 Raw response anni:', response);

                let anniData = [];

                if (Array.isArray(response)) {
                    anniData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    anniData = response.data;
                } else if (response?.results && Array.isArray(response.results)) {
                    anniData = response.results;
                } else {
                    console.warn('Formato dati non riconosciuto:', response);
                    anniData = [];
                }

                setAnni(anniData);
                setError('');

            } catch (err) {
                setError('Errore nel caricamento degli anni');
                console.error('❌ Errore fetch anni:', err);
                setAnni([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProgetti();
        fetchAnni();
    }, []);

    useEffect(() => {
        const fetchDocente = async () => {
            try {
                let response = [];
                // if (searchTerm && searchTerm.trim() !== '') {
                //     Se c'è un termine di ricerca, usa l'endpoint search
                //     response = await docentiService.getSearch(searchTerm);
                // } else {
                //     Altrimenti, prendi tutti i docenti
                response = await docentiService.getAll();
                // }
                // ;

                console.log('📦 Risposta API:', response);

                const docentiData = response.data;

                let filtered = selectedProgetto
                    ? docentiData.filter(d =>
                        d.codiciProgettiAnni?.split('\n')
                            .some(pa => pa.split(':')[0].trim() === selectedProgetto.trim())
                    )
                    : docentiData;

                filtered = selectedAnno
                    ? filtered.filter(d => {
                        if (selectedProgetto) {
                            return d.codiciProgettiAnni?.split('\n')
                                .some(pa => {
                                    const [cod, anno] = pa.split(':');
                                    return cod.trim() === selectedProgetto.trim() && anno?.trim() === String(selectedAnno);
                                });
                        }
                        return d.anni?.split(',').map(s => s.trim()).includes(String(selectedAnno));
                    })
                    : filtered;
                setDocenti(filtered);
                setError('');

            } catch (err) {
                console.error('❌ Errore fetch:', err);
                setError('Errore nel caricamento dei docenti');
                setDocenti([]);
            }
        };

        const fetchProgetti = async () => {
            try {
                const response = selectedAnno ? await progettiService.getByAnno(selectedAnno) : await progettiService.getAll();

                console.log('📦 Risposta API:', response);

                let progettiData = [];

                if (Array.isArray(response)) {
                    progettiData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    progettiData = response.data;
                } else if (response?.progetti && Array.isArray(response.progetti)) {
                    progettiData = response.progetti;
                } else if (response?.results && Array.isArray(response.results)) {
                    progettiData = response.results;
                } else {
                    console.warn('Formato dati non riconosciuto:', response);
                    progettiData = [];
                }

                setProgetti(progettiData);
                setError('');

            } catch (err) {
                setError('Errore nel caricamento dei progetti');
                console.error('❌ Errore fetch:', err);
                setProgetti([]);
            }
        };

        fetchDocente();
        fetchProgetti();

    }, [selectedProgetto, selectedAnno]);

    return (
        <div className="flex flex-col h-full w-full">
            <Header user={user} title="Docenti" subtitle="Elenco e gestione del corpo docente" />

            {error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">⚠️</span>
                        <div className="text-red-700 font-medium">{error}</div>
                    </div>
                </div>
            ) : (
                loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader />
                    </div>
                ) : (
                    <div className='flex-1 min-h-0'>
                        <div className='flex flex-col gap-[2vh] h-full overflow-hidden'>
                            <Container className="flex flex-col h-full overflow-hidden p-[2vh] gap-[2vh]">
                                <div className='grid grid-cols-7 w-full flex items-end'>
                                    <div className="col-span-6 flex gap-[2vh] items-end">
                                        <SelectFilter
                                            title="Corso"
                                            placeholder="Seleziona un corso"
                                            options={progetti.map(progetto => ({ value: progetto.codice, label: progetto.descrizione }))}
                                            value={selectedProgetto}
                                            onChange={setSelectedProgetto}
                                            className="w-[40%]"
                                        />
                                        <SelectFilter
                                            title="Anno"
                                            placeholder="Seleziona un anno"
                                            options={anni.map(anno => ({ value: anno.anno, label: "Anno " + anno.anno }))}
                                            value={selectedAnno}
                                            onChange={setSelectedAnno}
                                            className="w-[20%]"
                                        />

                                        <div className='pb-[0.5vh]'>
                                            <Button variant="noBg" size="small" onClick={() => { setSelectedProgetto(null); setSelectedAnno(null); }} className={`shrink-0  ${!(selectedAnno || selectedProgetto) ? "invisible" : ''}`} title="Rimuovi filtri">
                                                <SvgIcon
                                                    viewBox='0 0 24 24'
                                                    color='#D64541'
                                                    width="1.5vh"
                                                    height="1.5vh"
                                                    path1="M20.6523 4.34438C21.1819 3.73729 21.0976 2.83557 20.4601 2.33115C19.8227 1.82672 18.8759 1.90708 18.3463 2.51417L12 9.76804L5.65373 2.51417C5.1241 1.90708 4.17731 1.82673 3.53987 2.33115C2.90243 2.83558 2.81806 3.73729 3.3477 4.34438L10.0455 12L3.3477 19.6556C2.81806 20.2627 2.90243 21.1644 3.53987 21.6689C4.17731 22.1733 5.1241 22.0929 5.65373 21.4858L12 14.232L18.3463 21.4858C18.8759 22.0929 19.8227 22.1733 20.4601 21.6689C21.0976 21.1644 21.1819 20.2627 20.6523 19.6556L13.9545 12L20.6523 4.34438Z"
                                                />
                                            </Button>
                                        </div>

                                        {/* <div className='h-full flex items-end'>
                                            <Input
                                                placeholder={"Cerca studenti..."}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                noerror={true}
                                                icon={
                                                    <SvgIcon
                                                        color="#777777"
                                                        width="1.5vh"
                                                        height="1.5vh"
                                                        strokeWidth="2.5"
                                                        path1="M10.4615 18.9231C15.1347 18.9231 18.9231 15.1347 18.9231 10.4615C18.9231 5.78835 15.1347 2 10.4615 2C5.78835 2 2 5.78835 2 10.4615C2 15.1347 5.78835 18.9231 10.4615 18.9231Z"
                                                        path2="M22 22L16.6154 16.6154"
                                                        viewBox="0 0 24 24"
                                                    />
                                                }
                                                classNameIn="focus:ring-0 py-[1vh] px-[2vh] text-[1.5vh] focus:!border-[#E0E6EB] focus:shadow-none transition-none"
                                            />
                                        </div> */}

                                    </div>
                                    <Button
                                        variant="primary"
                                        size="medium"
                                        icon={<SvgIcon
                                            color='#FFFFFF'
                                            color2='#EFA134'
                                            width="2.5vh"
                                            height="2.5vh"
                                            path1='M24.5039 18.0286H14.9805C16.0611 17.9358 17.0631 17.445 17.7782 16.6583C18.4934 15.8717 18.8667 14.8495 18.8207 13.8042C18.7747 12.759 18.3129 11.771 17.5312 11.0456C16.7495 10.3202 15.708 9.9131 14.6231 9.90893H11.5123C11.9773 9.30584 12.31 8.61762 12.4899 7.88632C12.6697 7.15503 12.6931 6.39605 12.5584 5.65577C12.4237 4.9155 12.1339 4.20949 11.7066 3.58091C11.2794 2.95233 10.7237 2.4144 10.0735 2L24.5039 2C25.1662 2.00095 25.8011 2.25535 26.2691 2.70734C26.7371 3.15934 27 3.77197 27 4.41071V15.6232C27 16.9518 25.8816 18.0304 24.5039 18.0304V18.0286ZM6.90519 9.9125C7.36115 9.92273 7.81462 9.84496 8.23897 9.68376C8.66331 9.52257 9.04995 9.28119 9.37618 8.97383C9.7024 8.66646 9.96163 8.29931 10.1386 7.89396C10.3156 7.4886 10.4068 7.05322 10.4068 6.61339C10.4068 6.17357 10.3156 5.73819 10.1386 5.33283C9.96163 4.92747 9.7024 4.56032 9.37618 4.25296C9.04995 3.94559 8.66331 3.70422 8.23897 3.54302C7.81462 3.38182 7.36115 3.30406 6.90519 3.31429C6.01166 3.33433 5.16171 3.69072 4.53711 4.30724C3.91251 4.92376 3.56282 5.75147 3.56282 6.61339C3.56282 7.47531 3.91251 8.30303 4.53711 8.91955C5.16171 9.53607 6.01166 9.89245 6.90519 9.9125ZM16.5249 13.9768C16.5249 12.9625 15.6731 12.1411 14.6231 12.1411H6.90704C6.26257 12.1408 5.62437 12.2631 5.02891 12.5008C4.43345 12.7385 3.89241 13.0871 3.4367 13.5266C2.98099 13.966 2.61955 14.4878 2.37303 15.062C2.12652 15.6363 1.99976 16.2517 2 16.8732V19.025C2 19.975 2.79994 20.7446 3.78505 20.7446H4.10355L4.62573 25.4054C4.67457 25.843 4.88926 26.2478 5.22862 26.5421C5.56798 26.8364 6.00809 26.9994 6.46448 27H7.39404C7.84074 26.9998 8.27232 26.8439 8.60921 26.561C8.9461 26.2782 9.1656 25.8874 9.22724 25.4607L10.6216 15.8107H14.6213C15.6712 15.8107 16.523 14.9893 16.523 13.9768H16.5249Z'
                                            path2='M23.35 7.81V3.19H24.64V7.81H23.35ZM21.62 6.11V4.89H26.38V6.11H21.62Z'
                                        />}
                                        className="xl:px-[2vh] h-fit"
                                    >
                                        Nuovo Docente
                                    </Button>
                                </div>
                                <Table
                                    headers={['Nome Cognome', 'Codice Fiscale', 'Data Nascita', 'Contatti', 'Corsi e Moduli Affidati']}
                                    labels={['nomeCompletoQualifica', 'cf', 'dataNascita', 'contatti', 'corsoModulo']}
                                    data={docenti}
                                    customRender={{
                                        nomeCompletoQualifica: (value) => {
                                            const [nome, qualifica] = value.split('\n');
                                            return (
                                                <div className='flex flex-col w-full'>
                                                    <span className="font-bold whitespace-nowrap">{nome}</span>
                                                    <span className="text-sm font-normal whitespace-nowrap">Qualifiche: {qualifica}</span>
                                                </div>
                                            );
                                        },
                                        contatti: (value) => {
                                            const [email, telefono] = value.split('\n');
                                            return (
                                                <div className='flex flex-col w-full'>
                                                    <div className="font-bold"><span className="text-sm font-normal whitespace-nowrap">Email: </span>{email}</div>
                                                    <div className="font-bold"><span className="text-sm font-normal whitespace-nowrap">Telefono: </span>{telefono}</div>
                                                </div>
                                            );
                                        },
                                        corsoModulo: (value) => <CorsoModuloCell value={value} />
                                    }}
                                    frase1="Nessun docente trovato"
                                    className="h-full"
                                />
                            </Container>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Aule;