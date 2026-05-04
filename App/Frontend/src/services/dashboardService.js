import { progettiService } from './progettiService';
import { studentiService } from './studentiService';
import { docentiService } from './docentiService';
import { auleService } from './auleService';
import { lezioniService } from './lezioniService';
import { moduliService } from './moduliService';

export const dashboardService = {

  // Esegue TUTTE le chiamate in parallelo
  getAll: async () => {
    const [
      corsiCount,
      corsiCompletion,
      studenti,
      studentiIncrement,
      docenti,
      aule,
      sedi,
      lezioni,
      allProgetti,
      allSedi,
      allAule,
      allModuli,
      allDocenti
    ] = await Promise.allSettled([
      progettiService.getCount(),
      progettiService.getCompletion(),
      studentiService.getCount(),
      studentiService.getIncrement(),
      docentiService.getCount(),
      auleService.getCountA(),
      auleService.getCountS(),
      lezioniService.getComingLezioni(),
      progettiService.getAll(),
      auleService.getAllSedi(),
      auleService.getAllAule(),
      moduliService.getAll(),
      docentiService.getAll()
    ]);

    // Promise.allSettled non lancia errori, ogni risultato ha status: 'fulfilled' o 'rejected'
    return {
      corsiCount:        corsiCount.status === 'fulfilled'        ? corsiCount.value.data         : 'N/D',
      corsiCompletion:   corsiCompletion.status === 'fulfilled'   ? corsiCompletion.value.data    : [],
      studentiCount:     studenti.status === 'fulfilled'          ? studenti.value.data           : 'N/D',
      studentiIncrement: studentiIncrement.status === 'fulfilled' ? studentiIncrement.value.data + '%'  : 'N/D',
      docentiCount:      docenti.status === 'fulfilled'           ? docenti.value.data            : 'N/D',
      auleCount:         aule.status === 'fulfilled'              ? aule.value.data               : 'N/D',
      sediCount:         sedi.status === 'fulfilled'              ? sedi.value.data               : 'N/D',
      lezioni:           lezioni.status === 'fulfilled'           ? lezioni.value.data            : [],
      allProgetti:       allProgetti.status === 'fulfilled'       ? allProgetti.value.data        : [],
      allSedi:           allSedi.status === 'fulfilled'           ? allSedi.value.data            : [],
      allAule:           allAule.status === 'fulfilled'           ? allAule.value.data            : [],
      allModuli:         allModuli.status === 'fulfilled'         ? allModuli.value.data          : [],
      allDocenti:        allDocenti.status === 'fulfilled'        ? allDocenti.value.data         : []
    };
  },

  newStudent: async (studentData) => {
    try {
      const response = await studentiService.create(studentData);
      return response;
    } catch (error) {
      console.error('Errore nella creazione dello studente:', error);
      throw error;
    }
  },

  newTeacher: async (teacherData) => {
    try {
      const response = await docentiService.create(teacherData);
      return response;
    } catch (error) {
      console.error('Errore nella creazione del docente:', error);
      throw error;
    }
  },

  newClassroom: async (classroomData) => {
    try {
      const response = await auleService.createA(classroomData);
      return response;
    } catch (error) {
      console.error('Errore nella creazione dell\'aula:', error);
      throw error;
    }
  },

  newLesson: async (lessonData) => {
    try {
      const response = await lezioniService.createLezione(lessonData);
      return response;
    } catch (error) {
      console.error('Errore nella creazione della lezione:', error);
      throw error;
    }
  }
};