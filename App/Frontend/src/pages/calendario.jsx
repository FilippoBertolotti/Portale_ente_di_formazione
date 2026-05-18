import Loader from '../components/common/loader';
import Header from '../components/common/header';
import Container from '../components/common/container';
import LessonTag from '../components/common/lessonTag';
import NoteTag from '../components/common/noteTag';
import { useAuth } from '../hooks/useAuth';
import { lezioniService } from '../services/lezioniService';
import { moduliService } from '../services/moduliService';
import { auleService } from '../services/auleService';
import { docentiService } from '../services/docentiService';
import { useEffect, useRef, useState } from 'react';
import Button from '../components/common/button';
import SvgIcon from '../assets/icons/svgIcon';
import ConfirmationModal from '../components/common/confirmationModal';
import Form from '../components/forms/form';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { isCFValid, isOraInizioValid, isOraFineValid, isModuleValid, isClassroomValid, isDateValid2, isPlaceNameValid, isDescriptionValid, isDateValid } from '../utils/validators';
import { useToast } from '../components/common/toastProvider';

const Calendario = () => {
  const { user, loading } = useAuth();
  const [lezioni, setLezioni] = useState([]);
  const [note, setNote] = useState([]);
  const [moduli, setModuli] = useState([]);
  const [aule, setAule] = useState([]);
  const [docenti, setDocenti] = useState([]);
  const [loadingLezioni, setLoadingLezioni] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(new Date());
  const [showNewLessonModal, setShowNewLessonModal] = useState(false);
  const [showUpdateLessonModal, setShowUpdateLessonModal] = useState(false);
  const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
  const [selectedLezione, setSelectedLezione] = useState(null);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [showUpdateNoteModal, setShowUpdateNoteModal] = useState(false);
  const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const LessonFormRef = useRef();
  const NoteFormRef = useRef();
  const { showToast } = useToast();

  const meseAnno = activeDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  const mesePrecedente = () => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() - 1, 1));
  const meseSeguente = () => setActiveDate(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, 1));
  const isCurrentMonth = activeDate.getMonth() == new Date().getMonth() && 
                       activeDate.getFullYear() == new Date().getFullYear();

  const goToToday = () => {setActiveDate(new Date()); setSelectedDate(new Date())};

  const fetchLezioni = async () => {
    try {
      setLoadingLezioni(true);
      const data = await lezioniService.getAllLezioni();
      setLezioni(data.data || []);
      const notedata = await lezioniService.getAllNote();
      setNote(notedata.data || []);
      const modulidata = await moduliService.getAll();
      setModuli(modulidata.data || []);
      const auledata = await auleService.getAllAule();
      setAule(auledata.data || []);
      const docentidata = await docentiService.getAll();
      setDocenti(docentidata.data || []);
    } catch (error) {
      console.error('Errore caricamento dati:', error);
    } finally {
      setLoadingLezioni(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchLezioni();
    }
  }, [loading]);

  const handleNewLesson = async (formData) => {
    try {
      await lezioniService.createLezione(formData);
      showToast('Lezione aggiunta con successo', 'success');
      await fetchLezioni();
      setShowNewLessonModal(false);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleUpdateLessonClick = (lezione) => {
    setSelectedLezione(lezione);
    setShowUpdateLessonModal(true);
  };

  const handleDeleteLessonClick = (lezione) => {
    setSelectedLezione(lezione);
    setShowDeleteLessonModal(true);
  };

  const handleUpdateLesson = async (formdata) => {
    try {
      await lezioniService.updateLezione(selectedLezione.id, formdata);
      showToast('Lezione aggiornata con successo', 'success');
      await fetchLezioni();
      setShowUpdateLessonModal(false);
      setSelectedLezione(null);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleDeleteLesson = async () => {
    try {
      await lezioniService.deleteLezione(selectedLezione.id);
      showToast('Lezione eliminata con successo', 'success');
      await fetchLezioni();
      setShowDeleteLessonModal(false);
      setSelectedLezione(null);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleNewNote = async (formData) => {
    try {
      await lezioniService.createNota(formData);
      showToast('Nota aggiunta con successo', 'success');
      await fetchLezioni();
      setShowNewNoteModal(false);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleUpdateNoteClick = (nota) => {
    setSelectedNota(nota);
    setShowUpdateNoteModal(true);
  };

  const handleDeleteNoteClick = (nota) => {
    setSelectedNota(nota);
    setShowDeleteNoteModal(true);
  };

  const handleUpdateNote = async (formdata) => {
    try {
      await lezioniService.updateNota(selectedNota.id, formdata);
      showToast('Nota aggiornata con successo', 'success');
      await fetchLezioni();
      setShowUpdateNoteModal(false);
      setSelectedNota(null);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  const handleDeleteNote = async () => {
    try {
      await lezioniService.deleteNota(selectedNota.id);
      showToast('Nota eliminata con successo', 'success');
      await fetchLezioni();
      setShowDeleteNoteModal(false);
      setSelectedNota(null);
    } catch (error) {
      console.error('Errore:', error);
      showToast('Errore: ' + error.message, 'error');
    }
  };

  // Lezioni del giorno selezionato
  const lezioniDelGiorno = lezioni.filter(l => {
    const dataLezione = new Date(l.data);
    return (
      dataLezione.getFullYear() === selectedDate.getFullYear() &&
      dataLezione.getMonth() === selectedDate.getMonth() &&
      dataLezione.getDate() === selectedDate.getDate()
    );
  });

  const noteDelGiorno = note.filter(n => {
    const dataNota = new Date(n.data);
    return (
      dataNota.getFullYear() === selectedDate.getFullYear() &&
      dataNota.getMonth() === selectedDate.getMonth() &&
      dataNota.getDate() === selectedDate.getDate()
    );
  });

  // Pallini colorati per ogni giorno
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;

    const lezioniDelGiorno = lezioni.filter(l => {
      const d = new Date(l.data);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });

    let noteDelGiorno = note.filter(n => {
      const d = new Date(n.data);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });

    if (lezioniDelGiorno.length === 0 && noteDelGiorno.length === 0) return null;

    noteDelGiorno = noteDelGiorno.slice(0, 1).map(n => ({ ...n, colore_progetto: '#888888' }));

    const totale = [...noteDelGiorno, ...lezioniDelGiorno];

    // Mostra max 3 pallini, poi "+N"
    const visibili = totale.slice(0, 3);
    const extra = totale.length - 3;

    return (
      <div className=" h-full flex justify-center items-center gap-[2px] mt-[0.5rem] flex-wrap">
        {visibili.map((l, i) => (
          <span
            key={i}
            style={{ backgroundColor: l.colore_progetto }}
            className="w-[0.875rem] h-[0.875rem] rounded-full inline-block"
          />
        ))}
        {extra > 0 && (
          <span className="text-[0.875rem] text-gray-400 leading-none">+{extra}</span>
        )}
      </div>
    );
  };

  // Evidenzia i giorni con lezioni
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    const haLezioni = lezioni.some(l => {
      const d = new Date(l.data);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
    return haLezioni ? 'has-lessons' : null;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">

      <Header user={user} title="Calendario" subtitle="Tutte le attività in un’unica vista" />

      <div className='grid grid-cols-12 gap-[1vw] flex-1 min-h-0'>
        {/* Calendario */}
        <div className='col-span-8 flex flex-col gap-[1vw] h-full overflow-hidden'>
          <Container
            title={
              <div className="flex items-center gap-[1rem]">
                <Button onClick={mesePrecedente} variant="modify" icon={<SvgIcon
                  width="1.5vh"
                  height="1.5vh"
                  color="#FFFFFF"
                  strokeWidth={0}
                  viewBox="0 0 30 30"
                  path1="M18.3751 14.9979L26.2905 7.1098C26.5141 6.88622 26.6916 6.62082 26.8127 6.32878C26.9335 6.03663 26.9959 5.72357 26.9959 5.40745C26.9959 5.09133 26.9336 4.77827 26.8127 4.48612C26.6916 4.19408 26.5141 3.92867 26.2905 3.7051C26.067 3.48153 25.8015 3.30418 25.5091 3.18327C25.2169 3.06224 24.9038 3 24.5875 3C24.2711 3 23.9581 3.06224 23.666 3.18327C23.3735 3.30429 23.108 3.48153 22.8844 3.7051L13.29 13.2956C13.0652 13.5186 12.8868 13.7838 12.7649 14.076C12.6431 14.3681 12.5805 14.6814 12.5805 14.9979C12.5805 15.3146 12.6431 15.628 12.7649 15.92C12.8868 16.2123 13.0652 16.4774 13.29 16.7002L22.8844 26.2908C23.1076 26.5157 23.3728 26.6941 23.665 26.8156C23.9574 26.9374 24.2709 27 24.5875 27C24.904 27 25.2176 26.9374 25.51 26.8156C25.8022 26.6941 26.0675 26.5157 26.2905 26.2908C26.5153 26.0681 26.6938 25.8029 26.8155 25.5106C26.9374 25.2186 27 24.9052 27 24.5885C27 24.2719 26.9374 23.9586 26.8155 23.6665C26.6938 23.3743 26.5153 23.1091 26.2905 22.8861L18.3751 14.9979ZM5.39853 3.0098C4.76245 3.0098 4.15231 3.26245 3.70243 3.71204C3.25265 4.16173 3 4.77153 3 5.40745V24.5885C3 25.2246 3.25265 25.8343 3.70253 26.2838C4.15231 26.7336 4.76245 26.9861 5.39853 26.9861C6.03461 26.9861 6.64486 26.7336 7.09463 26.2838C7.54451 25.8343 7.79716 25.2246 7.79716 24.5885V5.40745C7.79716 4.77153 7.54451 4.16173 7.09463 3.71204C6.64486 3.26245 6.03471 3.0098 5.39853 3.0098Z"
                />}></Button>
                <span className="font-bold text-[1.2rem] capitalize w-[8vw] text-center">{meseAnno}</span>
                <Button onClick={meseSeguente} variant="modify" icon={<SvgIcon
                  width="1.5vh"
                  height="1.5vh"
                  color="#FFFFFF"
                  strokeWidth={0}
                  viewBox="0 0 30 30"
                  path1="M11.6249 15.0021L3.70947 22.8902C3.48591 23.1138 3.30839 23.3792 3.18732 23.6712C3.06645 23.9634 3.00408 24.2764 3.00408 24.5926C3.00408 24.9087 3.06635 25.2217 3.18732 25.5139C3.30839 25.8059 3.48591 26.0713 3.70947 26.2949C3.93303 26.5185 4.19855 26.6958 4.49091 26.8167C4.78307 26.9378 5.09616 27 5.41251 27C5.72887 27 6.04185 26.9378 6.33401 26.8167C6.62648 26.6957 6.892 26.5185 7.11556 26.2949L16.71 16.7044C16.9348 16.4814 17.1132 16.2162 17.2351 15.924C17.3569 15.6319 17.4195 15.3186 17.4195 15.0021C17.4195 14.6854 17.3569 14.372 17.2351 14.08C17.1132 13.7877 16.9348 13.5226 16.71 13.2998L7.11556 3.70918C6.8924 3.48429 6.62719 3.30592 6.33503 3.18439C6.04257 3.06255 5.72907 3 5.41251 3C5.09596 3 4.78236 3.06255 4.48999 3.18439C4.19783 3.30592 3.93252 3.48429 3.70947 3.70918C3.48469 3.93194 3.30625 4.19714 3.18446 4.48939C3.06258 4.78143 3 5.0948 3 5.41153C3 5.72806 3.06258 6.04143 3.18446 6.33347C3.30625 6.62571 3.48469 6.89092 3.70947 7.11388L11.6249 15.0021ZM24.6015 26.9902C25.2375 26.9902 25.8477 26.7376 26.2976 26.288C26.7473 25.8383 27 25.2285 27 24.5926L27 5.41153C27 4.77541 26.7473 4.16571 26.2975 3.71622C25.8477 3.26643 25.2375 3.01388 24.6015 3.01388C23.9654 3.01388 23.3551 3.26643 22.9054 3.71622C22.4555 4.16571 22.2028 4.77541 22.2028 5.41153L22.2028 24.5926C22.2028 25.2285 22.4555 25.8383 22.9054 26.288C23.3551 26.7376 23.9653 26.9902 24.6015 26.9902Z"
                />}></Button>
                <Button variant="noBg" onClick={goToToday} className={`${!isCurrentMonth || selectedDate.getDate() !== new Date().getDate() ? "" : "opacity-0"}`}>
                  Oggi
                </Button>
              </div>
            }
            button={
              <div className="flex items-center gap-[1rem]">
                <Button variant="secondary" size="medium"
                  icon={<SvgIcon color='#FFFFFF' strokeWidth='1' width="2.5vh" height="2.5vh"
                    path1='M16.0933 26.2821L15.1429 26.2857C12.5434 26.2857 10.0066 26.2049 7.55858 26.0513C5.76826 25.9389 4.34678 24.5175 4.23441 22.7272C4.08077 20.2791 4 17.7423 4 15.1429C4 12.5434 4.08077 10.0066 4.23441 7.55858C4.34678 5.76826 5.76826 4.34678 7.55858 4.23441C10.0066 4.08076 12.5434 4 15.1429 4C17.7423 4 20.2791 4.08076 22.7271 4.23441C24.5175 4.34678 25.939 5.76826 26.0513 7.55858C26.2049 10.0066 26.2857 12.5434 26.2857 15.1429L26.2658 17.3693 M26.2857 17.3624C25.3896 22.8936 20.0712 25.8787 16.0714 26.2992C17.5943 24.2699 18.6668 22.2038 19.1342 19.0807C19.2783 18.1175 20.0756 17.3624 21.0495 17.3624H26.2857Z'
                    path2='M20.56 11.62V7.38H21.19V11.62H20.56ZM18.7 9.8V9.21H23.05V9.8H18.7Z'
                  />}
                  onClick={() => setShowNewNoteModal(true)}
                >
                  Nuova Nota
                </Button>
                <Button variant="tertiary" size="medium"
                  icon={<SvgIcon color='#FFFFFF' width="2.5vh" height="2.5vh"
                    path1='M27 7.71427C27 6.70389 26.6238 5.73489 25.954 5.02048C25.2842 4.30602 24.3758 3.90465 23.4286 3.90465H22.5357V2.97907C22.5357 2.46659 22.1663 2.02668 21.6858 2.00111C21.5651 1.99488 21.4445 2.01489 21.3312 2.0599C21.2179 2.10491 21.1144 2.17396 21.0269 2.26291C20.9394 2.3518 20.8698 2.45877 20.8222 2.57731C20.7746 2.69579 20.75 2.82334 20.75 2.95231V3.90465H8.24997V2.97907C8.24997 2.46659 7.88055 2.02668 7.40011 2.00111C7.27941 1.99488 7.15877 2.01489 7.04551 2.0599C6.93221 2.10491 6.82868 2.17396 6.7412 2.26291C6.65372 2.3518 6.58404 2.45877 6.53642 2.57731C6.48881 2.69579 6.4643 2.82334 6.4643 2.95231V3.90465H5.57144C4.62421 3.90465 3.71583 4.30602 3.04603 5.02048C2.37628 5.73489 2 6.70389 2 7.71427V8.42857C2 8.49166 2.02349 8.55221 2.06537 8.59688C2.10725 8.6415 2.16401 8.66667 2.22322 8.66667H26.7768C26.836 8.66667 26.8928 8.6415 26.9346 8.59688C26.9765 8.55221 27 8.49166 27 8.42857V7.71427Z'
                    path2='M2 23.8246C2 24.7552 2.37628 25.6477 3.04603 26.3057C3.71583 26.9637 4.62421 27.3334 5.57144 27.3334H23.4286C24.3758 27.3334 25.2842 26.9637 25.954 26.3057C26.6238 25.6477 27 24.7552 27 23.8246V10.8312C27 10.7875 26.9824 10.7457 26.9509 10.7149C26.9196 10.684 26.877 10.6667 26.8326 10.6667H2.16741C2.12303 10.6667 2.08041 10.684 2.04905 10.7149C2.01764 10.7457 2 10.7875 2 10.8312V23.8246ZM21.1964 12.4211C21.4613 12.4211 21.7203 12.4983 21.9406 12.6429C22.1607 12.7874 22.3325 12.9929 22.4338 13.2334C22.5352 13.4738 22.5617 13.7384 22.51 13.9936C22.4583 14.2488 22.3308 14.4833 22.1435 14.6673C21.9561 14.8513 21.7176 14.9766 21.4577 15.0274C21.1979 15.0781 20.9286 15.0521 20.6839 14.9525C20.4392 14.8529 20.23 14.6842 20.0829 14.4679C19.9358 14.2515 19.8572 13.9972 19.8572 13.7369C19.8572 13.3879 19.9983 13.0532 20.2494 12.8064C20.5006 12.5598 20.8412 12.4211 21.1964 12.4211ZM21.1964 16.8071C21.4613 16.8071 21.7203 16.8843 21.9406 17.0288C22.1607 17.1734 22.3325 17.3789 22.4338 17.6194C22.5352 17.8598 22.5617 18.1244 22.51 18.3795C22.4583 18.6348 22.3308 18.8692 22.1435 19.0533C21.9561 19.2373 21.7176 19.3626 21.4577 19.4134C21.1979 19.4641 20.9286 19.4381 20.6839 19.3384C20.4392 19.2389 20.23 19.0702 20.0829 18.8539C19.9358 18.6375 19.8572 18.3831 19.8572 18.1229C19.8572 17.7739 19.9983 17.4392 20.2494 17.1924C20.5006 16.9457 20.8412 16.8071 21.1964 16.8071ZM16.7322 12.4211C16.9971 12.4211 17.256 12.4983 17.4763 12.6429C17.6964 12.7874 17.8682 12.9929 17.9695 13.2334C18.0709 13.4738 18.0974 13.7384 18.0457 13.9936C17.9941 14.2488 17.8665 14.4833 17.6792 14.6673C17.4918 14.8513 17.2533 14.9766 16.9934 15.0274C16.7337 15.0781 16.4643 15.0521 16.2196 14.9525C15.9749 14.8529 15.7657 14.6842 15.6186 14.4679C15.4715 14.2515 15.3929 13.9972 15.3929 13.7369C15.3929 13.3879 15.534 13.0532 15.7851 12.8064C16.0363 12.5598 16.377 12.4211 16.7322 12.4211ZM16.7322 16.8071C16.9971 16.8071 17.256 16.8843 17.4763 17.0288C17.6964 17.1734 17.8682 17.3789 17.9695 17.6194C18.0709 17.8598 18.0974 18.1244 18.0457 18.3795C17.9941 18.6348 17.8665 18.8692 17.6792 19.0533C17.4918 19.2373 17.2533 19.3626 16.9934 19.4134C16.7337 19.4641 16.4643 19.4381 16.2196 19.3384C15.9749 19.2389 15.7657 19.0702 15.6186 18.8539C15.4715 18.6375 15.3929 18.3831 15.3929 18.1229C15.3929 17.7739 15.534 17.4392 15.7851 17.1924C16.0363 16.9457 16.377 16.8071 16.7322 16.8071ZM16.7322 21.193C16.9971 21.193 17.256 21.2702 17.4763 21.4148C17.6964 21.5594 17.8682 21.7649 17.9695 22.0053C18.0709 22.2457 18.0974 22.5103 18.0457 22.7655C17.9941 23.0208 17.8665 23.2552 17.6792 23.4393C17.4918 23.6232 17.2533 23.7485 16.9934 23.7994C16.7337 23.8501 16.4643 23.824 16.2196 23.7244C15.9749 23.6249 15.7657 23.4561 15.6186 23.2398C15.4715 23.0234 15.3929 22.7691 15.3929 22.5088C15.3929 22.1598 15.534 21.8251 15.7851 21.5784C16.0363 21.3317 16.377 21.193 16.7322 21.193ZM12.2678 16.8071C12.5328 16.8071 12.7917 16.8843 13.012 17.0288C13.2321 17.1734 13.4039 17.3789 13.5052 17.6194C13.6066 17.8598 13.6331 18.1244 13.5814 18.3795C13.5298 18.6348 13.4022 18.8692 13.2149 19.0533C13.0276 19.2373 12.789 19.3626 12.5292 19.4134C12.2694 19.4641 12 19.4381 11.7554 19.3384C11.5106 19.2389 11.3015 19.0702 11.1543 18.8539C11.0072 18.6375 10.9286 18.3831 10.9286 18.1229C10.9286 17.7739 11.0697 17.4392 11.3208 17.1924C11.572 16.9457 11.9127 16.8071 12.2678 16.8071ZM12.2678 21.193C12.5328 21.193 12.7917 21.2702 13.012 21.4148C13.2321 21.5594 13.4039 21.7649 13.5052 22.0053C13.6066 22.2457 13.6331 22.5103 13.5814 22.7655C13.5298 23.0208 13.4022 23.2552 13.2149 23.4393C13.0276 23.6232 12.789 23.7485 12.5292 23.7994C12.2694 23.8501 12 23.824 11.7554 23.7244C11.5106 23.6249 11.3015 23.4561 11.1543 23.2398C11.0072 23.0234 10.9286 22.7691 10.9286 22.5088C10.9286 22.1598 11.0697 21.8251 11.3208 21.5784C11.572 21.3317 11.9127 21.193 12.2678 21.193ZM7.80354 16.8071C8.06848 16.8071 8.32741 16.8843 8.54765 17.0288C8.76783 17.1734 8.9396 17.3789 9.0409 17.6194C9.1423 17.8598 9.16882 18.1244 9.11716 18.3795C9.06545 18.6348 8.9379 18.8692 8.75061 19.0533C8.56327 19.2373 8.3247 19.3626 8.06486 19.4134C7.80508 19.4641 7.53574 19.4381 7.2911 19.3384C7.04636 19.2389 6.83718 19.0702 6.69002 18.8539C6.54286 18.6375 6.4643 18.3831 6.4643 18.1229C6.4643 17.7739 6.60546 17.4392 6.85653 17.1924C7.1077 16.9457 7.44836 16.8071 7.80354 16.8071ZM7.80354 21.193C8.06848 21.193 8.32741 21.2702 8.54765 21.4148C8.76783 21.5594 8.9396 21.7649 9.0409 22.0053C9.1423 22.2457 9.16882 22.5103 9.11716 22.7655C9.06545 23.0208 8.9379 23.2552 8.75061 23.4393C8.56327 23.6232 8.3247 23.7485 8.06486 23.7994C7.80508 23.8501 7.53574 23.824 7.2911 23.7244C7.04636 23.6249 6.83718 23.4561 6.69002 23.2398C6.54286 23.0234 6.4643 22.7691 6.4643 22.5088C6.4643 22.1598 6.60546 21.8251 6.85653 21.5784C7.1077 21.3317 7.44836 21.193 7.80354 21.193ZM26.35 4.81V0.19H27.64V4.81H26.35ZM24.62 3.11V1.89H29.38V3.11H24.62Z'
                  />}
                  onClick={() => setShowNewLessonModal(true)}
                >
                  Nuova Lezione
                </Button>
              </div>
            }
            className="h-full overflow-hidden"
          >
            {loadingLezioni ? (
              <div className="flex items-center justify-center h-full">
                <Loader />
              </div>
            ) : (
              <div className="flex-1 min-h-0 w-full">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  activeStartDate={activeDate}
                  onActiveStartDateChange={({ activeStartDate }) => setActiveDate(activeStartDate)}
                  tileContent={tileContent}
                  tileClassName={tileClassName}
                  locale="it-IT"
                  showNavigation={false}
                  showFixedNumberOfWeeks={true}
                />
              </div>
            )}
          </Container>
        </div>
        {/* Lezioni del giorno selezionato */}
        <div className='col-span-4 h-full flex flex-col gap-[1vw] overflow-hidden '> {/* con order-1 dico che sarà il primo elemento */}
          <Container title={`Lezioni ${selectedDate.getDate() == new Date().getDate() ? 'di oggi' : selectedDate.toLocaleDateString('it-IT')}`} className=" h-full overflow-hidden">
            {loadingLezioni ? (
              <div className="flex items-center justify-center h-[100%] w-[100%]">
                <Loader />
              </div>
              ) : (
              <div className="space-y-[1vh] overflow-y-auto h-full pr-2 flex-1">
                { lezioniDelGiorno.length > 0 && noteDelGiorno.length > 0 ? (
                    <>
                      {noteDelGiorno.map((nota, index) => (
                        <NoteTag
                          key={`nota-${index}`}
                          titolo={nota.titolo}
                          descrizione={nota.descrizione}
                          data={nota.data}
                          onModify={() => handleUpdateNoteClick(nota)}
                          onDelete={() => handleDeleteNoteClick(nota)}
                        />
                      ))}
                      {lezioniDelGiorno.map((lezione, index) => (
                        <LessonTag
                          key={`lezione-${index}`}
                          modulo={lezione.modulo}
                          data={lezione.data}
                          oraInizio={lezione.orainizio}
                          oraFine={lezione.orafine}
                          colore={lezione.colore_progetto}
                          aula={lezione.aula}
                          docente={lezione.docente}
                          onModify={() => handleUpdateLessonClick(lezione)}
                          onDelete={() => handleDeleteLessonClick(lezione)} 
                        />
                      ))}
                    </>
                  ) : lezioniDelGiorno.length > 0 ? (
                    lezioniDelGiorno.map((lezione, index) => (
                      <LessonTag
                        key={`lezione-${index}`}
                        modulo={lezione.modulo}
                        data={lezione.data}
                        oraInizio={lezione.orainizio}
                        oraFine={lezione.orafine}
                        colore={lezione.colore_progetto}
                        aula={lezione.aula}
                        docente={lezione.docente}
                        onModify={() => handleUpdateLessonClick(lezione)}
                        onDelete={() => handleDeleteLessonClick(lezione)}
                      />
                    ))
                  ) : noteDelGiorno.length > 0 ? (
                    noteDelGiorno.map((nota, index) => (
                      <NoteTag
                        key={index}
                        titolo={nota.titolo}
                        descrizione={nota.descrizione}
                        data={nota.data}
                        onModify={() => handleUpdateNoteClick(nota)}
                        onDelete={() => handleDeleteNoteClick(nota)}
                      />
                    ))
                  )  : (
                    <div className="flex flex-col items-center justify-center gap-[1vh] h-full">
                      <SvgIcon
                        color="#777777b9"
                        width="50"
                        height="50"
                        strokeWidth="2"
                        path1="M18.3398 7.125L11.6016 13.8633 M11.6016 7.125L18.3398 13.8633"
                        path2="M27.3398 18.3633V27.3516H2.61328V18.3633L7.10156 2.625H22.8398L27.3398 18.3633Z M3.73828 18.3633H10.4766C10.4454 18.9728 10.5386 19.5822 10.7504 20.1546C10.9622 20.7269 11.2882 21.2502 11.7086 21.6926C12.1289 22.135 12.6349 22.4873 13.1957 22.728C13.7565 22.9687 14.3604 23.0928 14.9707 23.0928C15.581 23.0928 16.1849 22.9687 16.7457 22.728C17.3065 22.4873 17.8125 22.135 18.2328 21.6926C18.6532 21.2502 18.9792 20.7269 19.191 20.1546C19.4028 19.5822 19.496 18.9728 19.4648 18.3633H26.2148 M27.3398 18.3633H19.4648C19.406 19.5155 18.9068 20.6011 18.0705 21.3959C17.2341 22.1906 16.1244 22.6337 14.9707 22.6337C13.817 22.6337 12.7073 22.1906 11.8709 21.3959C11.0346 20.6011 10.5354 19.5155 10.4766 18.3633H2.61328"   // Corpo e manici della borsa
                      />
                      <div className="flex items-center justify-center text-[#777777b9] ">
                        Niente in programma per oggi
                      </div>
                    </div>
                  )}
              </div>)}
          </Container>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showNewLessonModal}
        onClose={() => setShowNewLessonModal(false)}
        onConfirm={() => LessonFormRef.current?.submit()}  // Chiama il submit del form
        title="Nuova Lezione"
        confirmText="Aggiungi"
        buttonType="modify"
        w='60%'
        wMax='100%'
      >
        <Form
          ref={LessonFormRef}
          onSubmit={handleNewLesson}
          onCancel={() => setShowNewLessonModal(false)}
          fields={['data', 'orainizio', 'orafine', 'idmodulo', 'idaula', 'cfdocente']}
          labels={['Data', 'Ora Inizio', 'Ora Fine', 'Modulo', 'Aula', 'Docente']}
          types={['date', 'time', 'time', 'select', 'select', 'select']}
          placeholders={[selectedDate, null, null, 'Seleziona un modulo', 'Seleziona un aula', 'Seleziona un docente']}
          validators={[isDateValid2, isOraInizioValid, isOraFineValid, isModuleValid, isClassroomValid, isCFValid]}
          options={{
            idmodulo: Array.isArray(moduli) ? moduli.map(m => ({ value: m.id, label: m.descrizione })) : [],
            idaula: Array.isArray(aule) ? aule.map(a => ({ value: a.id, label: a.descrizione })) : [],
            cfdocente: Array.isArray(docenti) ? docenti.map(d => ({ value: d.cf, label: d.nomeCompleto })) : []
          }}
          layout={[
            ['idmodulo', 'idaula'],
            ['cfdocente'],
            ['data'],
            ['orainizio', 'orafine']
          ]}
          defaultValues={{
            data: selectedDate.toLocaleDateString('en-CA')
          }}
        />
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showUpdateLessonModal}
        onClose={() => setShowUpdateLessonModal(false)}
        onConfirm={() => LessonFormRef.current?.submit()}  // Chiama il submit del form
        title="Modifica Lezione"
        confirmText="Aggiorna"
        buttonType="modify"
        w='60%'
        wMax='100%'
      >
        <Form
          ref={LessonFormRef}
          onSubmit={handleUpdateLesson}
          onCancel={() => setShowUpdateLessonModal(false)}
          fields={['data', 'orainizio', 'orafine', 'idmodulo', 'idaula', 'cfdocente']}
          labels={['Data', 'Ora Inizio', 'Ora Fine', 'Modulo', 'Aula', 'Docente']}
          types={['date', 'time', 'time', 'select', 'select', 'select']}
          placeholders={[null, null, null, 'Seleziona un modulo', 'Seleziona un aula', 'Seleziona un docente']}
          validators={[isDateValid2, isOraInizioValid, isOraFineValid, isModuleValid, isClassroomValid, isCFValid]}
          options={{
            idmodulo: Array.isArray(moduli) ? moduli.map(m => ({ value: m.id, label: m.descrizione })) : [],
            idaula: Array.isArray(aule) ? aule.map(a => ({ value: a.id, label: a.descrizione })) : [],
            cfdocente: Array.isArray(docenti) ? docenti.map(d => ({ value: d.cf, label: d.nomeCompleto })) : []
          }}
          layout={[
            ['idmodulo', 'idaula'],
            ['cfdocente'],
            ['data'],
            ['orainizio', 'orafine']
          ]}
          defaultValues={{
            data: selectedLezione?.data
              ? new Date(selectedLezione.data).toLocaleDateString('en-CA')
              : '',
            orainizio: selectedLezione?.orainizio ? selectedLezione.orainizio.substring(0, 5) : '',
            orafine: selectedLezione?.orafine ? selectedLezione.orafine.substring(0, 5) : '',
            idmodulo: moduli.find(m => m.descrizione === selectedLezione?.modulo)?.id || '',
            idaula: selectedLezione?.idaula || '',
            cfdocente: selectedLezione?.cfdocente || ''
          }}
        />
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showDeleteLessonModal}
        onClose={() => setShowDeleteLessonModal(false)}
        onConfirm={handleDeleteLesson}
        title="Elimina Lezione"
        confirmText="Conferma"
        buttonType="danger"
      >
        <p>Sei sicuro di voler eliminare questa lezione?</p>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showNewNoteModal}
        onClose={() => setShowNewNoteModal(false)}
        onConfirm={() => NoteFormRef.current?.submit()}  // Chiama il submit del form
        title="Nuova Nota"
        confirmText="Aggiungi"
        buttonType="modify"
        w='60%'
        wMax='100%'
      >
        <Form
          ref={NoteFormRef}
          onSubmit={handleNewNote}
          onCancel={() => setShowNewNoteModal(false)}
          fields={['titolo', 'descrizione', 'data']}
          labels={['Titolo', 'Descrizione', 'Data']}
          types={['text', 'textarea', 'date']}
          placeholders={[null, null, null]}
          validators={[isPlaceNameValid, isDescriptionValid, isDateValid2]}
          layout={[
            ['titolo', 'data'],
            ['descrizione']
          ]}
          defaultValues={{
            data: selectedDate.toLocaleDateString('en-CA')
          }}
        />
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showUpdateNoteModal}
        onClose={() => setShowUpdateNoteModal(false)}
        onConfirm={() => NoteFormRef.current?.submit()}  // Chiama il submit del form
        title="Modifica Nota"
        confirmText="Aggiorna"
        buttonType="modify"
        w='60%'
        wMax='100%'
      >
        <Form
          ref={NoteFormRef}
          onSubmit={handleUpdateNote}
          onCancel={() => setShowUpdateNoteModal(false)}
          fields={['titolo', 'descrizione', 'data']}
          labels={['Titolo', 'Descrizione', 'Data']}
          types={['text', 'textarea', 'date']}
          placeholders={[null, null, null]}
          validators={[isPlaceNameValid, isDescriptionValid, isDateValid2]}
          layout={[
            ['titolo', 'data'],
            ['descrizione']
          ]}
          defaultValues={{
            titolo: selectedNota?.titolo || '',
            data: selectedNota?.data ? new Date(selectedNota.data).toLocaleDateString('en-CA') : selectedDate.toLocaleDateString('en-CA'),
            descrizione: selectedNota?.descrizione || ''
          }}
        />
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showDeleteNoteModal}
        onClose={() => setShowDeleteNoteModal(false)}
        onConfirm={handleDeleteNote}
        title="Elimina Nota"
        confirmText="Conferma"
        buttonType="danger"
      >
        <p>Sei sicuro di voler eliminare questa nota?</p>
      </ConfirmationModal>
    </div>
  );
};

export default Calendario;