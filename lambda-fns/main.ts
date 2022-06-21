import createOrUpdateRfq from './createOrUpdateRfq';
import createOrUpdateService from './createOrUpdateService';
import getRfqById from './getRfqById';
import getRfqByUserName from './getRfqByUserName';
import getAllRfq from './getAllRfq';
import getAllServices from './getAllServices';
import getServiceById from'./getServiceById';
import deleteService from'./deleteService';
import deleteRfq from'./deleteRfq';
import getRfqByService from './getRfqByService'

import Service from './Service';
import Rfq from './Rfq'

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     id: string,
     rfq: Rfq,
     service:Service
     name: string,
  }
}

exports.handler = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getRfqById":
            return await getRfqById(event.arguments.id);
        case "getRfqByUserName":
            return await getRfqByUserName(event.arguments.name);
        case "getServiceById":
            return await getServiceById(event.arguments.id);            
        case "createOrUpdateRfq":
            return await createOrUpdateRfq(event.arguments.rfq);
        case "createOrUpdateService":
            return await createOrUpdateService(event.arguments.service);    
        case "getAllRfq":
            return await getAllRfq();
        case "getAllServices":
            return await getAllServices();
        case "createOrUpdateRfq":
            return await deleteService(event.arguments.id);
        case "deleteRfq":
            return await deleteRfq(event.arguments.id);  
        case "getRfqByService":
            return await getRfqByService(event.arguments.id)              
        default:
            return null;
    }
}