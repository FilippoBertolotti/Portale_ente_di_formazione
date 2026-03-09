import { useState, useEffect } from 'react';
import { progettiService } from '../services/progettiService';
import { moduliService } from '../services/moduliService';
import Loader from '../components/common/Loader';
import Header from '../components/common/header';
import { useAuth } from '../hooks/useAuth';
import Container from '../components/common/container';
import Button from '../components/common/button';
import SvgIcon from '../assets/icons/svgIcon';
import Table from '../components/common/table';
import SelectFilter from '../components/common/selectFilter';

const Studenti = () => {
  const { user } = useAuth();
  const [progetti, setProgetti] = useState([]);
  const [anni, setAnni] = useState([]);
  const [moduli, setModuli] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProgetto, setSelectedProgetto] = useState(null);
  const [selectedAnno, setSelectedAnno] = useState(null);

  useEffect(() => {
    const fetchProgetti = async () => {
      try {
        setLoading(true);
        const response = selectedAnno ? await progettiService.getByCodiceAnno(selectedProgetto, selectedAnno) : await progettiService.getAll();

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
    const fetchModulo = async () => {
      try {
        let response = [];

        if (selectedProgetto) {
          response = await moduliService.getByCodiceProgetto(selectedProgetto);
        } else if (selectedAnno) {
          response = await moduliService.getByAnno(selectedAnno);
        }
        console.log('📦 Risposta API:', response);

        const moduliData =
          response?.data ??
          response?.moduli ??
          response?.results ??
          (Array.isArray(response) ? response : []);

        const filtered =
          selectedProgetto && selectedAnno
            ? moduliData.filter(m => m.anno == selectedAnno)
            : moduliData;

        setModuli(filtered);
        setError('');

      } catch (err) {
        console.error('❌ Errore fetch:', err);
        setError('Errore nel caricamento dei moduli');
        setModuli([]);
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

    if (selectedProgetto || selectedAnno) {
      fetchModulo();
    } else {
      setModuli(null);
    }

    fetchProgetti();

  }, [selectedProgetto, selectedAnno]);

  return (
    <div className="flex flex-col h-full w-full">
      <Header user={user} title="Corsi" subtitle="Consulta i corsi e i relativi dettagli" />

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
                <div className='flex gap-[2vh] items-end'>
                  <SelectFilter
                    title="Corso"
                    placeholder="Seleziona un corso"
                    options={progetti.map(progetto => ({ value: progetto.codice, label: progetto.descrizione }))}
                    value={selectedProgetto}
                    onChange={setSelectedProgetto}
                    className="w-[30%]"
                  />
                  <SelectFilter
                    title="Anno"
                    placeholder="Seleziona un anno"
                    options={anni.map(anno => ({ value: anno.anno, label: "Anno " + anno.anno }))}
                    value={selectedAnno}
                    onChange={setSelectedAnno}
                    className="w-[15%]"
                  />
                  {(selectedAnno || selectedProgetto) &&
                    <div className='pb-[0.5vh]'>
                      <Button variant="noBg" size="small" onClick={() => { setSelectedProgetto(null); setSelectedAnno(null); }} className="shrink-0" title="Rimuovi filtri">
                        <SvgIcon
                          viewBox='0 0 24 24'
                          color='#D64541'
                          width="1.5vh"
                          height="1.5vh"
                          path1="M20.6523 4.34438C21.1819 3.73729 21.0976 2.83557 20.4601 2.33115C19.8227 1.82672 18.8759 1.90708 18.3463 2.51417L12 9.76804L5.65373 2.51417C5.1241 1.90708 4.17731 1.82673 3.53987 2.33115C2.90243 2.83558 2.81806 3.73729 3.3477 4.34438L10.0455 12L3.3477 19.6556C2.81806 20.2627 2.90243 21.1644 3.53987 21.6689C4.17731 22.1733 5.1241 22.0929 5.65373 21.4858L12 14.232L18.3463 21.4858C18.8759 22.0929 19.8227 22.1733 20.4601 21.6689C21.0976 21.1644 21.1819 20.2627 20.6523 19.6556L13.9545 12L20.6523 4.34438Z"
                        />
                      </Button>
                    </div>
                  }
                </div>
                <Table
                  headers={['Nome Modulo', 'Ore Aula', 'ProjectWork', 'E-Learning', 'Stage', 'Docenti']}
                  labels={['descrizione', 'oreaula', 'oreproject', 'oreelearn', 'orestage', 'lista_docenti']}
                  data={moduli}
                  pill={true}
                  frase1 = "Nessuno studente trovato"
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

export default Studenti;