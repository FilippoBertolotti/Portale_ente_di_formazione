import { useState, useEffect, useRef } from 'react';
import { auleService } from '../services/auleService';
import Loader from '../components/common/Loader';
import Header from '../components/common/header';
import { useAuth } from '../hooks/useAuth';
import Container from '../components/common/container';
import Button from '../components/common/button';
import SvgIcon from '../assets/icons/svgIcon';
import Table from '../components/common/table';
import Select from '../components/common/select';
import Card from '../components/common/card';
import { isAddressValid, isCapacityValid, isCapValid, isDescriptionValid, isNameValid, isPhoneValid, isPianoValid, isPlaceNameValid, isSedeValid } from '../utils/validators';
import ConfirmationModal from '../components/common/confirmationModal';
import Form from '../components/forms/form';

const AttivaCell = ({ value }) => {
    return (
        <div className="flex items-center px-[0.2vw]">
            <span
                style={{ backgroundColor: value ? '#F0FDF4' : '#FEF2F2' }}
                className={`w-full rounded-full px-[1vh] py-[0.3vh] text-xs ${value ? 'text-green-600' : 'text-red-600'} w-full`}
            >
                {value ? 'Disponibile' : 'In Manutenzione'}
            </span>
        </div>
    );
};

const Aule = () => {
    const { user } = useAuth();
    const [sedi, setSedi] = useState([]);
    const [piani, setPiani] = useState([]);
    const [aule, setAule] = useState([]);
    const [stats, setStats] = useState(null);
    const [riepilogo, setRiepilogo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSede, setSelectedSede] = useState(null);
    const [selectedPiano, setSelectedPiano] = useState(null);
    const [showNewClassroomModal, setShowNewClassroomModal] = useState(false);
    const [showNewSiteModal, setShowNewSiteModal] = useState(false);
    const [showDeleteSiteModal, setShowDeleteSiteModal] = useState(false);
    const ClassroomFormRef = useRef(null);
    const SiteFormRef = useRef(null);

    const fetchAula = async () => {
        try {
            let response = [];
            response = await auleService.getAllAule();

            console.log('📦 Risposta API:', response);

            const auleData = response.data;

            let filtered = selectedSede
            ? auleData.filter(d => {
                // Se selectedSede è la stringa 'Non Specificata'
                if (selectedSede === 'Non Specificata') {
                    return d.idsede === null;
                }
                // Altrimenti confronto normale (entrambi numeri)
                return d.idsede === selectedSede;
            })
            : auleData;

            filtered = selectedPiano
                ? filtered.filter(d =>
                    d.piano === selectedPiano
                )
                : filtered;

            setAule(filtered);
            setError('');

        } catch (err) {
            console.error('❌ Errore fetch:', err);
            setError('Errore nel caricamento delle aule');
            setAule([]);
        }
    };

    const fetchStats = async () => {
        try {
            const statsResponse = await auleService.getStats(selectedSede, selectedPiano);
            setStats(statsResponse.data || statsResponse);
        } catch (err) {
            console.error('❌ Errore fetch stats:', err);
            setStats(null);
        }
    }

    const fetchRiepilogo = async () => {
        if (selectedSede) {
            try {
                const infSede = await auleService.getSedeById(selectedSede);
                console.log('📦 Info sede:', infSede);
                setRiepilogo(infSede.data || infSede);
            } catch (err) {
                console.error('❌ Errore fetch riepilogo:', err);
                setRiepilogo(null);
            }
        } else {
            setRiepilogo(null);
        }
    }

    const fetchSedi = async () => {
        try {
            setLoading(true);
            const response = await auleService.getAllSedi();

            console.log('📦 Risposta API:', response);

            let sediData = [];

            if (Array.isArray(response)) {
                sediData = response;
            } else if (response?.data && Array.isArray(response.data)) {
                sediData = response.data;
            } else {
                console.warn('Formato dati non riconosciuto:', response);
                sediData = [];
            }

            setSedi(sediData);
            setError('');

        } catch (err) {
            setError('Errore nel caricamento delle sedi');
            console.error('❌ Errore fetch:', err);
            setSedi([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        const fetchPiani = async () => {
            try {
                setLoading(true);
                const response = await auleService.getPiani();

                console.log('📦 Raw response piani:', response);

                let pianiData = [];

                if (Array.isArray(response)) {
                    pianiData = response;
                } else if (response?.data && Array.isArray(response.data)) {
                    pianiData = response.data;
                } else {
                    console.warn('Formato dati non riconosciuto:', response);
                    pianiData = [];
                }

                setPiani(pianiData);
                setError('');

            } catch (err) {
                setError('Errore nel caricamento dei piani');
                console.error('❌ Errore fetch piani:', err);
                setPiani([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSedi();
        fetchPiani();
    }, []);

    useEffect(() => {
        fetchAula();
        fetchStats();
        fetchRiepilogo();

    }, [selectedSede, selectedPiano]);

    const handleNewClassroom = async (formData) => {
        try {
            await auleService.createA(formData);
            await fetchAula();
            await fetchStats();
            await fetchRiepilogo();
            setShowNewClassroomModal(false);
        } catch (error) {
            console.error('Errore:', error);
        }
    };

    const handleNewSite = async (formData) => {
        try {
            await auleService.createS(formData);
            await fetchSedi();
            setShowNewSiteModal(false);
        } catch (error) {
            console.error('Errore:', error);
        }
    };

    const handleDeleteSite = async () => {
        try {
            await auleService.deleteSede(selectedSede);
            await fetchSedi();
            setSelectedSede(null);
            setSelectedPiano(null);
            setShowDeleteSiteModal(false);
        } catch (error) {
            console.error('Errore:', error);
        }
    };

    return (
        <div className="flex flex-col h-full w-full">
            <Header user={user} title="Aule" subtitle="Aule, sedi e capienze disponibili" />

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
                    <div className='grid grid-cols-12 gap-[1vw] flex-1 min-h-0'>
                        <div className='col-span-9 flex flex-col gap-[1vw] h-full overflow-hidden'>
                            <div className='flex flex-col gap-[1vw] h-full overflow-hidden'>
                                <Container className="flex flex-col h-full overflow-hidden p-[1vw] gap-[1vw]">
                                    <div className='grid grid-cols-7 w-full flex items-end'>
                                        <div className="col-span-6 flex gap-[1vw] items-end">
                                            <Select
                                                title="Sede"
                                                placeholder="Seleziona una sede"
                                                options={sedi.map(sede => ({ value: sede.id, label: sede.nome })).concat({ value: 'Non Specificata', label: 'Non Specificata' })}
                                                value={selectedSede}
                                                onChange={setSelectedSede}
                                                className="w-[40%]"
                                            />
                                            <Select
                                                title="Piano"
                                                placeholder="Seleziona un piano"
                                                options={piani.map(piano => ({ value: piano.piano, label: piano.piano }))}
                                                value={selectedPiano}
                                                onChange={setSelectedPiano}
                                                className="w-[20%]"
                                            />

                                            <div className='pb-[0.5vh]'>
                                                <Button variant="noBg" size="small" onClick={() => { setSelectedSede(null); setSelectedPiano(null); }} className={`shrink-0  ${!(selectedPiano || selectedSede) ? "invisible" : ''}`} title="Rimuovi filtri">
                                                    <SvgIcon
                                                        viewBox='0 0 24 24'
                                                        color='#D64541'
                                                        width="1.5vh"
                                                        height="1.5vh"
                                                        path1="M20.6523 4.34438C21.1819 3.73729 21.0976 2.83557 20.4601 2.33115C19.8227 1.82672 18.8759 1.90708 18.3463 2.51417L12 9.76804L5.65373 2.51417C5.1241 1.90708 4.17731 1.82673 3.53987 2.33115C2.90243 2.83558 2.81806 3.73729 3.3477 4.34438L10.0455 12L3.3477 19.6556C2.81806 20.2627 2.90243 21.1644 3.53987 21.6689C4.17731 22.1733 5.1241 22.0929 5.65373 21.4858L12 14.232L18.3463 21.4858C18.8759 22.0929 19.8227 22.1733 20.4601 21.6689C21.0976 21.1644 21.1819 20.2627 20.6523 19.6556L13.9545 12L20.6523 4.34438Z"
                                                    />
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                    <Table
                                        headers={['Nome Aula', 'Sede', 'Piano', 'Capienza', 'N. Postazioni PC', 'Stato', 'Prenotazioni']}
                                        labels={['descrizione', 'nome_sede', 'piano', 'capienza', 'numeropc', 'attiva', 'prenotazioni']}
                                        data={aule}
                                        pill={true}
                                        centered={true}
                                        centerFromIndex={3}
                                        customRender={{
                                            attiva: (value) => <AttivaCell value={value} />
                                        }}
                                        frase1="Nessuna aula trovata"
                                        className="h-full"
                                    />
                                </Container>
                            </div>
                        </div>
                        <div className='col-span-3 h-full flex flex-col gap-[1vw] overflow-hidden'>
                            <Container title="Azioni Rapide" className="h-[30%]">
                                <div className='grid grid-cols-2 gap-[1vw]'>
                                    <Button
                                        variant="primary"
                                        size="medium"
                                        icon={<SvgIcon
                                            color='#FFFFFF'
                                            width="2.5vh"
                                            height="2.5vh"
                                            path1="M23.35 10.81V6.19H24.64V10.81H23.35ZM21.62 9.11V7.89H26.38V9.11H21.62Z"
                                            path2="M19.1871 2.29551C17.7526 2.21717 16.4582 2.21717 15.0236 2.29551C14.3605 2.33172 13.8128 2.84267 13.711 3.51999C13.6113 4.18258 13.5791 4.81077 13.6142 5.45108C13.6121 5.48269 13.611 5.51458 13.611 5.54672V9.81215C11.2204 10.3413 9.14019 12.2845 8.99523 15.6614C8.98681 15.7986 8.97873 15.9347 8.97097 16.0699V28.1786C10.323 28.2083 11.7254 28.2278 13.143 28.2368L13.1428 28.2111V24.372C13.1428 23.3463 13.9743 22.5149 15 22.5149C16.0256 22.5149 16.8571 23.3463 16.8571 24.372V28.2111L16.8569 28.2368C18.2745 28.2278 19.6769 28.2083 21.0288 28.1786V15.9691L21.0112 15.6725C20.8678 12.3288 18.7876 10.3728 16.3967 9.82393V7.66037C17.3203 7.67857 18.222 7.66134 19.1871 7.60863C19.8502 7.57242 20.398 7.06146 20.4998 6.38415C20.6472 5.40437 20.6472 4.49978 20.4998 3.51999C20.398 2.84267 19.8502 2.33172 19.1871 2.29551ZM23.3503 16.5311V28.1157C23.9525 28.096 24.5392 28.0739 25.1064 28.0497C26.4875 27.9905 27.5849 26.8654 27.7562 25.436C27.9146 24.1137 28 23.2221 28 22.3173C28 21.4123 27.9146 20.5208 27.7562 19.1986C27.5849 17.7691 26.4875 16.6439 25.1064 16.5848C24.6544 16.5655 24.024 16.5475 23.3503 16.5311ZM6.64954 28.1157V16.5311C5.97538 16.5476 5.34505 16.5655 4.89356 16.5848C3.51254 16.6439 2.41505 17.7691 2.24386 19.1986C2.0855 20.5208 2 21.4123 2 22.3173C2 23.2221 2.0855 24.1137 2.24386 25.436C2.41505 26.8654 3.51254 27.9905 4.89356 28.0497C5.4608 28.0739 6.04735 28.096 6.64954 28.1157ZM15 18.369C16.3099 18.369 17.0467 17.6084 17.0467 16.2563C17.0467 14.9042 16.3099 14.1436 15 14.1436C13.6901 14.1436 12.9533 14.9042 12.9533 16.2563C12.9533 17.6084 13.6901 18.369 15 18.369Z"
                                        />}
                                        onClick={() => setShowNewSiteModal(true)}
                                    >
                                        Nuova Sede
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="medium"
                                        icon={<SvgIcon
                                            color='#ffffff'
                                            width="2.5vh"
                                            height="2.5vh"
                                            path1="M23.35 10.81V6.19H24.64V10.81H23.35ZM21.62 9.11V7.89H26.38V9.11H21.62Z"
                                            path2="M19.1871 2.29551C17.7526 2.21717 16.4582 2.21717 15.0236 2.29551C14.3605 2.33172 13.8128 2.84267 13.711 3.51999C13.6113 4.18258 13.5791 4.81077 13.6142 5.45108C13.6121 5.48269 13.611 5.51458 13.611 5.54672V9.81215C11.2204 10.3413 9.14019 12.2845 8.99523 15.6614C8.98681 15.7986 8.97873 15.9347 8.97097 16.0699V28.1786C10.323 28.2083 11.7254 28.2278 13.143 28.2368L13.1428 28.2111V24.372C13.1428 23.3463 13.9743 22.5149 15 22.5149C16.0256 22.5149 16.8571 23.3463 16.8571 24.372V28.2111L16.8569 28.2368C18.2745 28.2278 19.6769 28.2083 21.0288 28.1786V15.9691L21.0112 15.6725C20.8678 12.3288 18.7876 10.3728 16.3967 9.82393V7.66037C17.3203 7.67857 18.222 7.66134 19.1871 7.60863C19.8502 7.57242 20.398 7.06146 20.4998 6.38415C20.6472 5.40437 20.6472 4.49978 20.4998 3.51999C20.398 2.84267 19.8502 2.33172 19.1871 2.29551ZM23.3503 16.5311V28.1157C23.9525 28.096 24.5392 28.0739 25.1064 28.0497C26.4875 27.9905 27.5849 26.8654 27.7562 25.436C27.9146 24.1137 28 23.2221 28 22.3173C28 21.4123 27.9146 20.5208 27.7562 19.1986C27.5849 17.7691 26.4875 16.6439 25.1064 16.5848C24.6544 16.5655 24.024 16.5475 23.3503 16.5311ZM6.64954 28.1157V16.5311C5.97538 16.5476 5.34505 16.5655 4.89356 16.5848C3.51254 16.6439 2.41505 17.7691 2.24386 19.1986C2.0855 20.5208 2 21.4123 2 22.3173C2 23.2221 2.0855 24.1137 2.24386 25.436C2.41505 26.8654 3.51254 27.9905 4.89356 28.0497C5.4608 28.0739 6.04735 28.096 6.64954 28.1157ZM15 18.369C16.3099 18.369 17.0467 17.6084 17.0467 16.2563C17.0467 14.9042 16.3099 14.1436 15 14.1436C13.6901 14.1436 12.9533 14.9042 12.9533 16.2563C12.9533 17.6084 13.6901 18.369 15 18.369Z"
                                        />}
                                        onClick={() => setShowNewClassroomModal(true)}
                                    >
                                        Nuova Aula
                                    </Button>
                                    <Button
                                        variant="modify"
                                        size="medium"
                                        icon={<SvgIcon
                                            color='#FFFFFF'
                                            width="2.5vh"
                                            height="2.5vh"
                                            path1='M9.02793 25.3511L2 27L3.64884 19.9728L20.9817 2.63703C21.1836 2.43507 21.4233 2.27487 21.6871 2.16556C21.9509 2.05626 22.2336 2 22.5191 2C22.8047 2 23.0874 2.05626 23.3512 2.16556C23.615 2.27487 23.8547 2.43507 24.0566 2.63703L26.363 4.94246C26.5649 5.14434 26.7251 5.38403 26.8344 5.64784C26.9437 5.91164 27 6.1944 27 6.47996C27 6.76551 26.9437 7.04827 26.8344 7.31208C26.7251 7.57589 26.5649 7.81557 26.363 8.01745L9.02793 25.3511Z'
                                        />}
                                        disabled={!selectedSede}
                                    >
                                        Modifica Sede
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="medium"
                                        icon={<SvgIcon
                                            color='#FFFFFF'

                                            width="2.5vh"
                                            height="2.5vh"
                                            path1='M23.2187 9.81254H7.69792C7.62587 9.81231 7.55456 9.82703 7.48849 9.85577C7.42242 9.88451 7.36303 9.92665 7.31408 9.97952C7.26513 10.0324 7.22768 10.0948 7.2041 10.1629C7.18052 10.231 7.17132 10.3032 7.17708 10.375L8.51042 25.1042C8.55735 25.6236 8.7974 26.1065 9.18313 26.4575C9.56886 26.8086 10.0722 27.0021 10.5937 27H20.3229C20.8444 27.0021 21.3478 26.8086 21.7335 26.4575C22.1193 26.1065 22.3593 25.6236 22.4062 25.1042L23.7917 10.3334C23.7974 10.2616 23.7882 10.1893 23.7646 10.1212C23.7411 10.0532 23.7036 9.99072 23.6547 9.93785C23.6057 9.88498 23.5463 9.84285 23.4803 9.81411C23.4142 9.78537 23.3429 9.77065 23.2708 9.77088L23.2187 9.81254ZM13.6354 23.3542C13.6354 23.5614 13.5531 23.7601 13.4066 23.9066C13.2601 24.0531 13.0614 24.1354 12.8542 24.1354C12.647 24.1354 12.4482 24.0531 12.3017 23.9066C12.1552 23.7601 12.0729 23.5614 12.0729 23.3542V13.9792C12.0729 13.772 12.1552 13.5733 12.3017 13.4268C12.4482 13.2803 12.647 13.198 12.8542 13.198C13.0614 13.198 13.2601 13.2803 13.4066 13.4268C13.5531 13.5733 13.6354 13.772 13.6354 13.9792V23.3542ZM18.8437 23.3542C18.8437 23.5614 18.7614 23.7601 18.6149 23.9066C18.4684 24.0531 18.2697 24.1354 18.0625 24.1354C17.8553 24.1354 17.6566 24.0531 17.5101 23.9066C17.3636 23.7601 17.2812 23.5614 17.2812 23.3542V13.9792C17.2812 13.772 17.3636 13.5733 17.5101 13.4268C17.6566 13.2803 17.8553 13.198 18.0625 13.198C18.2697 13.198 18.4684 13.2803 18.6149 13.4268C18.7614 13.5733 18.8437 13.772 18.8437 13.9792V23.3542Z'
                                            path2='M25.875 6.16666H20.9271C20.858 6.16666 20.7918 6.13922 20.7429 6.09039C20.6941 6.04155 20.6667 5.97531 20.6667 5.90624V4.60416C20.6667 3.9135 20.3923 3.25112 19.9039 2.76274C19.4155 2.27437 18.7532 2 18.0625 2H12.8542C12.1635 2 11.5011 2.27437 11.0127 2.76274C10.5244 3.25112 10.25 3.9135 10.25 4.60416V5.90624C10.25 5.97531 10.2226 6.04155 10.1737 6.09039C10.1249 6.13922 10.0586 6.16666 9.98958 6.16666H5.04167C4.7654 6.16666 4.50045 6.27641 4.3051 6.47176C4.10975 6.66711 4 6.93206 4 7.20832C4 7.48459 4.10975 7.74954 4.3051 7.94489C4.50045 8.14024 4.7654 8.24999 5.04167 8.24999H25.875C26.1513 8.24999 26.4162 8.14024 26.6116 7.94489C26.8069 7.74954 26.9167 7.48459 26.9167 7.20832C26.9167 6.93206 26.8069 6.66711 26.6116 6.47176C26.4162 6.27641 26.1513 6.16666 25.875 6.16666ZM12.3333 5.90624V4.60416C12.3333 4.46603 12.3882 4.33355 12.4859 4.23588C12.5836 4.1382 12.716 4.08333 12.8542 4.08333H18.0625C18.2006 4.08333 18.3331 4.1382 18.4308 4.23588C18.5284 4.33355 18.5833 4.46603 18.5833 4.60416V5.90624C18.5833 5.97531 18.5559 6.04155 18.507 6.09039C18.4582 6.13922 18.392 6.16666 18.3229 6.16666H12.5937C12.5247 6.16666 12.4584 6.13922 12.4096 6.09039C12.3608 6.04155 12.3333 5.97531 12.3333 5.90624Z'
                                        />}
                                        disabled={!selectedSede}
                                        onClick = {() => setShowDeleteSiteModal(true)}
                                    >
                                        Elimina Sede
                                    </Button>
                                </div>
                            </Container>
                            <Container title={selectedSede && selectedSede !== 'Non Specificata' ? `Infromazioni ${sedi.find(s => s.id === selectedSede)?.nome}` : 'Informazioni Aggiuntive'} className=" h-full overflow-hidden">
                                <div className=' flex flex-col space-y-[4vh] justify-between h-full overflow-hidden'>
                                    <div className='h-[47%] w-full items-stretch grid grid-cols-2 gap-[1vw] overflow-hidden'>
                                        <Card
                                            title="Aule Totali"
                                            value={stats ? stats.aule_totali : '...'}
                                            iconPath="M19.8313 0.0677923C18.1761 -0.0225975 16.6826 -0.0225975 15.0273 0.0677923C14.2622 0.109573 13.6302 0.699133 13.5126 1.48065C13.3977 2.24518 13.3605 2.97002 13.401 3.70884C13.3985 3.74531 13.3973 3.7821 13.3973 3.81919V8.74084C10.639 9.35139 8.23869 11.5935 8.07141 15.4899C8.06171 15.6482 8.05239 15.8053 8.04343 15.9613V29.9329C9.60351 29.9672 11.2216 29.9897 12.8573 30L12.8571 29.9704V25.5407C12.8571 24.3572 13.8165 23.3979 15 23.3979C16.1834 23.3979 17.1428 24.3572 17.1428 25.5407V29.9704L17.1426 30C18.7783 29.9897 20.3964 29.9672 21.9564 29.9329V15.845L21.936 15.5028C21.7706 11.6447 19.3703 9.38771 16.6116 8.75443V6.25802C17.6773 6.27902 18.7177 6.25914 19.8313 6.19832C20.5964 6.15654 21.2284 5.56697 21.3459 4.78545C21.516 3.65494 21.516 2.61118 21.3459 1.48065C21.2284 0.699135 20.5964 0.109573 19.8313 0.0677923ZM24.6349 16.4934V29.8603C25.3299 29.8376 26.0068 29.8121 26.6612 29.7842C28.2549 29.7159 29.5211 28.4177 29.7186 26.7684C29.9014 25.2426 30 24.2139 30 23.1699C30 22.1256 29.9014 21.0969 29.7186 19.5713C29.5211 17.922 28.2549 16.6237 26.6612 16.5555C26.1396 16.5331 25.4124 16.5124 24.6349 16.4934ZM5.36486 29.8603V16.4935C4.58698 16.5125 3.85967 16.5332 3.33872 16.5555C1.74523 16.6237 0.478903 17.922 0.281372 19.5713C0.098658 21.0969 0 22.1256 0 23.1699C0 24.2139 0.0986584 25.2426 0.281372 26.7684C0.478903 28.4177 1.74523 29.7159 3.33872 29.7842C3.99324 29.8121 4.67001 29.8376 5.36486 29.8603ZM15 18.6141C16.5114 18.6141 17.3616 17.7365 17.3616 16.1764C17.3616 14.6163 16.5114 13.7387 15 13.7387C13.4886 13.7387 12.6384 14.6163 12.6384 16.1764C12.6384 17.7365 13.4886 18.6141 15 18.6141Z"
                                            bgColor="[#EFA134]"
                                            size="small"
                                        />

                                        <Card
                                            title="Posti Totali"
                                            value={stats ? stats.posti_totali : '...'}
                                            iconPath="M23.3781 2.0061C24.0084 2.07026 24.5 2.6029 24.5 3.25V9.5H25.75L25.8781 9.5061C26.5084 9.57026 27 10.1029 27 10.75V24.5C27 25.1904 26.4404 25.75 25.75 25.75H24.5V27H22V25.75H7V27H4.5V25.75H3.25C2.55965 25.75 2 25.1904 2 24.5V10.75L2.0061 10.6218C2.07026 9.99166 2.6029 9.5 3.25 9.5H4.5V3.25L4.5061 3.12182C4.57026 2.49166 5.1029 2 5.75 2H23.25L23.3781 2.0061ZM4.5 23.25H24.5V12H22V19.5C22 20.1904 21.4404 20.75 20.75 20.75H8.25C7.55965 20.75 7 20.1904 7 19.5V12H4.5V23.25ZM9.5 15.75V18.25H19.5V15.75H9.5ZM7 9.5H8.25L8.37818 9.5061C9.00834 9.57026 9.5 10.1029 9.5 10.75V13.25H19.5V10.75L19.5061 10.6218C19.5702 9.99166 20.1029 9.5 20.75 9.5H22V4.5H7V9.5Z"
                                            bgColor="[#9BC4E8]"
                                            size="small"
                                        />

                                        <Card
                                            title="Aule con PC"
                                            value={stats ? stats.aule_pc : '...'}
                                            iconPath="M17.9398 7.64996V17.94H3.23981V7.64996H17.9398ZM3.23981 4.70996C1.61821 4.70996 0.299805 6.02837 0.299805 7.64996V17.94C0.299805 19.5616 1.61821 20.88 3.23981 20.88H8.62827L8.13674 22.35H4.7098C3.89671 22.35 3.23981 23.0069 3.23981 23.82C3.23981 24.6331 3.89671 25.29 4.7098 25.29H16.4698C17.2829 25.29 17.9398 24.6331 17.9398 23.82C17.9398 23.0069 17.2829 22.35 16.4698 22.35H13.0383L12.5467 20.88H17.9398C19.5614 20.88 20.8798 19.5616 20.8798 17.94V7.64996C20.8798 6.02837 19.5614 4.70996 17.9398 4.70996H3.23981ZM24.5548 4.70996C23.3375 4.70996 22.3498 5.69762 22.3498 6.91496V23.085C22.3498 24.3023 23.3375 25.29 24.5548 25.29H27.4948C28.7121 25.29 29.6998 24.3023 29.6998 23.085V6.91496C29.6998 5.69762 28.7121 4.70996 27.4948 4.70996H24.5548ZM25.2898 7.64996H26.7598C27.1641 7.64996 27.4948 7.98071 27.4948 8.38496C27.4948 8.78921 27.1641 9.11996 26.7598 9.11996H25.2898C24.8856 9.11996 24.5548 8.78921 24.5548 8.38496C24.5548 7.98071 24.8856 7.64996 25.2898 7.64996ZM24.5548 11.325C24.5548 10.9207 24.8856 10.59 25.2898 10.59H26.7598C27.1641 10.59 27.4948 10.9207 27.4948 11.325C27.4948 11.7292 27.1641 12.06 26.7598 12.06H25.2898C24.8856 12.06 24.5548 11.7292 24.5548 11.325ZM26.0248 18.675C27.1564 18.6749 27.8637 19.8999 27.2979 20.8799C27.0353 21.3348 26.55 21.615 26.0248 21.615C24.8932 21.615 24.1859 20.39 24.7517 19.41C25.0143 18.9551 25.4996 18.675 26.0248 18.675Z"
                                            bgColor="[#9BC4E8]"
                                            size="small"
                                        />

                                        <Card
                                            title="Non Disponibili"
                                            value={stats ? stats.non_disponibili : '...'}
                                            iconPath="M25.7733 9.37941C25.7402 9.19976 25.6696 9.02908 25.5662 8.87847C25.4628 8.72785 25.3289 8.60065 25.1733 8.50513L21.7447 11.9337C21.5848 12.0996 21.3931 12.2316 21.181 12.3217C20.9688 12.4118 20.7408 12.4583 20.5104 12.4583C20.28 12.4583 20.0519 12.4118 19.8398 12.3217C19.6277 12.2316 19.436 12.0996 19.2761 11.9337L17.9732 10.768C17.6591 10.4475 17.4832 10.0167 17.4832 9.56799C17.4832 9.11927 17.6591 8.68844 17.9732 8.36799L21.4018 4.93941C21.3271 4.76377 21.2146 4.60669 21.0724 4.47931C20.9302 4.35193 20.7617 4.25735 20.579 4.20227C19.3827 3.96371 18.1435 4.06583 17.0024 4.497C15.8613 4.92817 14.8642 5.67105 14.1246 6.6411C13.385 7.61115 12.9327 8.76935 12.819 9.98389C12.7126 11.1216 12.9073 12.2659 13.3819 13.3024L4.61038 22.0739C3.93123 22.7531 3.9425 23.8576 4.63535 24.5227L5.59668 25.4457C6.26722 26.0894 7.32862 26.0813 7.98946 25.4277L16.8666 16.6513C17.8731 17.067 18.9694 17.2251 20.0558 17.1086C21.2572 16.9799 22.3992 16.5204 23.3549 15.7814C24.3106 15.0424 25.0428 14.0527 25.4697 12.9225C25.8965 11.7923 26.0016 10.5658 25.7733 9.37941Z"
                                            bgColor="[#EFA134]"
                                            size="small"
                                        />
                                    </div>
                                    <div className='h-[50%] w-full flex flex-col gap-[1vw] overflow-hidden'>
                                        <div className='w-full flex items-end gap-[1vw]'>
                                            <SvgIcon
                                                color="black"
                                                width="1.5vw"
                                                height="1.5vw"
                                                strokeWidth="1"
                                                path1="M15.3512 27.7409C15.121 27.9094 14.8453 28 14.5625 28C14.2797 28 14.004 27.9094 13.7738 27.7409C6.97277 22.769 -0.245151 12.5419 7.05164 5.1519C9.05415 3.12977 11.7523 1.99749 14.5625 2C17.3792 2 20.0819 3.13393 22.0734 5.15045C29.3702 12.5405 22.1522 22.7661 15.3512 27.7409Z"
                                                path2="M14.5625 15C15.209 15 15.829 14.6576 16.2861 14.0481C16.7432 13.4386 17 12.612 17 11.75C17 10.888 16.7432 10.0614 16.2861 9.4519C15.829 8.84241 15.209 8.5 14.5625 8.5C13.916 8.5 13.296 8.84241 12.8389 9.4519C12.3818 10.0614 12.125 10.888 12.125 11.75C12.125 12.612 12.3818 13.4386 12.8389 14.0481C13.296 14.6576 13.916 15 14.5625 15Z"
                                            />
                                            <p className='text-1.5vw font-semibold'>{riepilogo ? riepilogo?.indirizzo + ", " + riepilogo?.nome_citta : '...'}</p>
                                        </div>
                                        <div className='w-full flex items-end gap-[1vw]'>
                                            <SvgIcon
                                                color="black"
                                                width="1.5vw"
                                                height="1.5vw"
                                                strokeWidth="1"
                                                path1="M20.2003 18.6432C16.7409 22.2833 7.91704 13.5385 11.3894 9.88402C13.5098 7.65233 11.115 5.10286 9.78899 3.22651C7.30028 -0.290748 1.83898 4.56552 2.00364 7.65522C2.52796 17.3995 13.0678 28.9465 23.274 27.9383C26.4661 27.6234 30.1349 21.8571 26.4719 19.7497C24.6418 18.6952 22.1271 16.6166 20.2003 18.6432Z"
                                            />
                                            <p className='text-1.5vw font-semibold'>{riepilogo?.telefono || '...'}</p>
                                        </div>
                                        <div className='w-full'>
                                            <p className='text-1.5vw font-normal'>Descrizione:</p>
                                            <p className='text-1.5vw font-semibold'>{riepilogo?.descrizione || 'Descrizione non disponibile'}</p>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </div>
                )
            )}

            <ConfirmationModal
                isOpen={showNewClassroomModal}
                onClose={() => setShowNewClassroomModal(false)}
                onConfirm={() => ClassroomFormRef.current?.submit()}  // Chiama il submit del form
                title="Nuova Aula"
                confirmText="Aggiungi"
                buttonType="modify"
                w='60%'
                wMax='100%'
            >
                <Form
                    ref={ClassroomFormRef}
                    onSubmit={handleNewClassroom}
                    onCancel={() => setShowNewClassroomModal(false)}
                    fields={['descrizione', 'capienza', 'numeropc', 'idsede', 'piano', 'attiva']}
                    labels={['Nome', 'Capienza', 'Numero PC', 'Sede', 'Piano', 'Stato']}
                    types={['text', 'number', 'number', 'select', 'text', 'select']}
                    placeholders={['Aula 101', '50', '10', 'Sede A', 'Piano Terra, Primo Piano...']}
                    validators={[
                        isPlaceNameValid,
                        isCapacityValid,
                        (pcCount, formValues) => {  // per numeropc - funzione personalizzata
                            const capacity = formValues?.capienza;
                            if (!capacity) return 'Inserisci prima la capienza';
                            if (!pcCount || pcCount < 0) return 'Numero PC non valido';
                            if (pcCount > capacity) return `Numero PC (${pcCount}) non può superare la capienza (${capacity})`;
                            return null;
                        },
                        isSedeValid,
                        isPianoValid
                    ]}
                    options={{
                        idsede: Array.isArray(sedi)
                            ? sedi.map(s => ({ value: s.id, label: s.nome }))
                            : [],

                        attiva: [
                            { value: true, label: 'Attiva' },
                            { value: false, label: 'In Manutenzione' }
                        ],
                    }}
                    layout={[
                        ['descrizione'],
                        ['capienza', 'numeropc'],
                        ['idsede', 'piano'],
                        ['attiva']
                    ]}
                />
            </ConfirmationModal>

            <ConfirmationModal
                isOpen={showNewSiteModal}
                onClose={() => setShowNewSiteModal(false)}
                onConfirm={() => SiteFormRef.current?.submit()}  // Chiama il submit del form
                title="Nuova Sede"
                confirmText="Aggiungi"
                buttonType="modify"
                w='60%'
                wMax='100%'
            >
                <Form
                    ref={SiteFormRef}
                    onSubmit={handleNewSite}
                    onCancel={() => setShowNewSiteModal(false)}
                    fields={['nome', 'telefono', 'indirizzo', 'nome_citta', 'cap', 'descrizione']}
                    labels={['Nome', 'Telefono', 'Indirizzo', 'Città', 'CAP', 'Descrizione']}
                    types={['text', 'text', 'text', 'text', 'text', 'text']}
                    placeholders={['Sede A', '0123456789', 'Via Roma 1', 'Reggio Emilia', '00100', 'Descrizione della sede']}
                    validators={[
                        isPlaceNameValid,
                        isPhoneValid,
                        isAddressValid,
                        isNameValid,
                        isCapValid,
                        isDescriptionValid
                    ]}
                    layout={[
                        ['nome', 'telefono'],
                        ['indirizzo'],
                        ['nome_citta', 'cap'],
                        ['descrizione']
                    ]}
                />
            </ConfirmationModal>

            <ConfirmationModal
                isOpen={showDeleteSiteModal}
                onClose={() => setShowDeleteSiteModal(false)}
                onConfirm={handleDeleteSite}  // Chiama il submit del form
                title="Elimina Sede"
                confirmText="Conferma"
                buttonType="danger"
            >
                <p>Sei sicuro di voler eliminare questa sede? Tutte le aule associate saranno disattivate.</p>
            </ConfirmationModal>
        </div>
    );
};

export default Aule;