import { useState, useEffect, useRef } from 'react';
import { progettiService } from '../services/progettiService';
import { studentiService } from '../services/studentiService';
import Loader from '../components/common/loader';
import Header from '../components/common/header';
import { useAuth } from '../hooks/useAuth';
import Container from '../components/common/container';
import Button from '../components/common/button';
import SvgIcon from '../assets/icons/svgIcon';
import Table from '../components/common/table';
import Select from '../components/common/select';
import Input from '../components/common/input';
import ConfirmationModal from '../components/common/confirmationModal';
import Form from '../components/forms/form';
import { isAcademicYearValid, isCFValid, isCourseValid, isDateValid, isEmailValid, isNameValid, isSurnameValid } from '../utils/validators';
import { useToast } from '../components/common/toastProvider';

const Studenti = () => {
  const { user } = useAuth();
  const [progetti, setProgetti] = useState([]);
  const [anni, setAnni] = useState([]);
  const [studenti, setStudenti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProgetto, setSelectedProgetto] = useState(null);
  const [selectedAnno, setSelectedAnno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [showUpdateStudentModal, setShowUpdateStudentModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [selectedStudente, setSelectedStudente] = useState(null);
  const { showToast } = useToast();
  const StudentFormRef = useRef();

  const fetchStudente = async () => {
    try {
      let response = [];
      if (searchTerm && searchTerm.trim() !== '') {
        // Se c'è un termine di ricerca, usa l'endpoint search
        response = await studentiService.getSearch(searchTerm);
      } else {
        // Altrimenti, prendi tutti gli studenti
        response = await studentiService.getAll();
      }

      const studentiData = response.data;

      let filtered =
        selectedProgetto
          ? studentiData.filter(s => s.codiceprogetto == selectedProgetto)
          : studentiData;

      filtered =
        selectedAnno
          ? filtered.filter(s => s.annoaccademico == selectedAnno)
          : filtered;

      setStudenti(filtered);
      setError('');

    } catch (err) {
      console.error('❌ Errore fetch:', err);
      setError('Errore nel caricamento dei studenti');
      setStudenti([]);
    }
  };

  const fetchProgetti = async () => {
    try {
      const response = selectedAnno ? await progettiService.getByAnno(selectedAnno) : await progettiService.getAll();

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

  useEffect(() => {

    const fetchAnni = async () => {
      try {
        setLoading(true);
        const response = await studentiService.getAnni();

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
    fetchStudente();
    fetchProgetti();

  }, [selectedProgetto, selectedAnno, searchTerm]);

  const handleNewStudent = async (formData) => {
    try {
      await studentiService.create(formData);
      showToast('Studente aggiunto con successo', 'success');
      fetchStudente(); // Ricarica la lista degli studenti dopo l'aggiunta
      setShowNewStudentModal(false);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleUpdateStudentClick = (studente) => {
    setSelectedStudente(studente);
    setShowUpdateStudentModal(true);
  };

  const handleDeleteStudentClick = (studente) => {
    setSelectedStudente(studente);
    setShowDeleteStudentModal(true);
  };

  const handleUpdateStudent = async (formdata) => {
    try {
      await studentiService.update(selectedStudente.cf, formdata);
      await fetchStudente();
      setShowUpdateStudentModal(false);
      setSelectedStudente(null);
      showToast('Studente aggiornato con successo', 'success');
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await studentiService.delete(selectedStudente.cf);
      showToast('Studente eliminato con successo', 'success');
      await fetchStudente();
      setShowDeleteStudentModal(false);
      setSelectedStudente(null);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Header user={user} title="Studenti" subtitle="Percorsi e profili degli studenti" />

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
            <div className='flex flex-col gap-[1vw] h-full overflow-hidden'>
              <Container className="flex flex-col h-full overflow-hidden p-[1vw] gap-[1vw]">
                <div className='grid grid-cols-7 w-full flex items-end'>
                  <div className="col-span-6 flex gap-[1vw] items-end">
                    <Select
                      title="Corso"
                      placeholder="Seleziona un corso"
                      options={progetti.map(progetto => ({ value: progetto.codice, label: progetto.descrizione }))}
                      value={selectedProgetto}
                      onChange={setSelectedProgetto}
                      className="w-[40%]"
                    />
                    <Select
                      title="Anno"
                      placeholder="Seleziona un anno"
                      options={anni.map(anno => ({ value: anno.annoaccademico, label: "Anno " + anno.annoaccademico }))}
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

                    <div className='h-full flex items-end'>
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
                        classNameIn="focus:ring-0 focus:!border-[#E0E6EB] focus:shadow-none transition-none"
                      />
                    </div>

                  </div>
                  <Button
                    variant="secondary"
                    size="medium"
                    icon={<SvgIcon
                      color='#FFFFFF'
                      width="2.5vh"
                      height="2.5vh"
                      path1='M26.25 25C26.9404 25 27.5 25.5596 27.5 26.25C27.5 26.9404 26.9404 27.5 26.25 27.5H3.75C3.05965 27.5 2.5 26.9404 2.5 26.25C2.5 25.5596 3.05965 25 3.75 25H26.25ZM5.9375 2.5C7.83597 2.5 9.375 4.03902 9.375 5.9375V9.375C9.375 11.7912 11.3337 13.75 13.75 13.75H16.25C19.9685 13.75 23.0201 15.171 24.5679 16.0571C25.6955 16.7027 26.25 17.8956 26.25 19.0625V22.5H8.75V21.8225C8.58559 21.6756 8.38299 21.4906 8.1543 21.2695C7.53564 20.6715 6.71059 19.8052 5.88379 18.7305C4.2522 16.6092 2.5 13.5276 2.5 10V5.9375C2.5 4.03902 4.03902 2.5 5.9375 2.5ZM16.25 2.5C19.0114 2.5 21.25 4.73857 21.25 7.5C21.25 10.2614 19.0114 12.5 16.25 12.5C13.4886 12.5 11.25 10.2614 11.25 7.5C11.25 4.73857 13.4886 2.5 16.25 2.5Z'
                      path2='M23.95 5.21002V0.590024H25.24V5.21002H23.95ZM22.22 3.51002V2.29002H26.98V3.51002H22.22Z'
                    />}
                    className="xl:px-[2vh] h-fit"
                    onClick={() => setShowNewStudentModal(true)}
                  >
                    Nuovo Studente
                  </Button>
                </div>
                <Table
                  headers={['Nome Cognome', 'Codice Fiscale', 'Data Nascita', 'Email', 'Corso']}
                  labels={['nomeCompleto', 'cf', 'FromattedDataNascita', 'email', 'corso']}
                  data={studenti}
                  frase1="Nessuno studente trovato"
                  className="h-full"
                  onModify = {handleUpdateStudentClick}
                  onDelete = {handleDeleteStudentClick}
                />
              </Container>
            </div>
          </div>
        )
      )}
      <ConfirmationModal
        isOpen={showNewStudentModal}
        onClose={() => setShowNewStudentModal(false)}
        onConfirm={() => StudentFormRef.current?.submit()}  // Chiama il submit del form
        title="Nuovo Studente"
        confirmText="Aggiungi"
        buttonType="modify"
        w='w-[80%] xl:w-[60%]'
        wMax='max-w-[100%]'
      >
        <Form
          ref={StudentFormRef}
          onSubmit={handleNewStudent}
          onCancel={() => setShowNewStudentModal(false)}
          fields={['cf', 'nome', 'cognome', 'email', 'dataNascita', 'corso', 'annoAccademico']}
          labels={['Codice Fiscale', 'Nome', 'Cognome', 'Email', 'Data di Nascita', 'Corso', 'Anno Accademico']}
          types={['text', 'text', 'text', 'email', 'date', 'select', 'select']}
          placeholders={['BNCDVD92M22H501V', 'Davida', 'Bianchi', 'davida.bianchi@email.it', '24/05/1992', 'Informatica, Economia, ...', '1']}
          validators={[isCFValid, isNameValid, isSurnameValid, isEmailValid, isDateValid, isCourseValid, isAcademicYearValid]}
          options={{
            corso: Array.isArray(progetti)
              ? progetti.map(p => ({ value: p.codice, label: p.descrizione }))
              : []
          }}
          layout={[
            ['cf'],
            ['nome', 'cognome'],
            ['dataNascita', 'email'],
            ['corso', 'annoAccademico']
          ]}
        />
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showUpdateStudentModal}
        onClose={() => setShowUpdateStudentModal(false)}
        onConfirm={() => StudentFormRef.current?.submit()}  // Chiama il submit del form
        title="Modifica Studente"
        confirmText="Aggiorna"
        buttonType="modify"
        w='w-[80%] xl:w-[60%]'
        wMax='max-w-[100%]'
      >
        <Form
          ref={StudentFormRef}
          onSubmit={handleUpdateStudent}
          onCancel={() => setShowUpdateStudentModal(false)}
          fields={['cf', 'nome', 'cognome', 'email', 'dataNascita', 'corso', 'annoAccademico']}
          labels={['Codice Fiscale', 'Nome', 'Cognome', 'Email', 'Data di Nascita', 'Corso', 'Anno Accademico']}
          types={['text', 'text', 'text', 'email', 'date', 'select', 'select']}
          placeholders={['BNCDVD92M22H501V', 'Davida', 'Bianchi', 'davida.bianchi@email.it', '24/05/1992', 'Informatica, Economia, ...', '1']}
          validators={[isCFValid, isNameValid, isSurnameValid, isEmailValid, isDateValid, isCourseValid, isAcademicYearValid]}
          options={{
            corso: Array.isArray(progetti)
              ? progetti.map(p => ({ value: p.codice, label: p.descrizione }))
              : []
          }}
          layout={[
            ['cf'],
            ['nome', 'cognome'],
            ['dataNascita', 'email'],
            ['corso', 'annoAccademico']
          ]}
          defaultValues={{
            cf: selectedStudente?.cf || '',
            nome: selectedStudente?.nome || '',
            cognome: selectedStudente?.cognome || '',
            email: selectedStudente?.email || '',
            dataNascita: selectedStudente?.dataNascita
              ? new Date(selectedStudente.dataNascita).toLocaleDateString('en-CA')
              : '',
            corso: selectedStudente?.codiceprogetto || '',
            annoAccademico: selectedStudente?.annoaccademico || ''
          }}
        />
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showDeleteStudentModal}
        onClose={() => setShowDeleteStudentModal(false)}
        onConfirm={handleDeleteStudent}
        title="Elimina Studente"
        confirmText="Conferma"
        buttonType="danger"
      >
        <p>Sei sicuro di voler eliminare questo studente?</p>
      </ConfirmationModal>
    </div>
  );
};

export default Studenti;

