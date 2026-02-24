import { progettiService } from './progettiService';
import { studentiService } from './studentiService';
import { docentiService } from './docentiService';
import { auleService } from './auleService';

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
      sedi
    ] = await Promise.allSettled([
      progettiService.getCount(),
      progettiService.getCompletion(),
      studentiService.getCount(),
      studentiService.getIncrement(),
      docentiService.getCount(),
      auleService.getCountA(),
      auleService.getCountS()
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
    };
  }
};