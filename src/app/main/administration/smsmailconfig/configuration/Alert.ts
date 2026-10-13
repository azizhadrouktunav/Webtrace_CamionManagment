export class Alert {


    AlertType: any;
    SendingPeriod: any;
    AlertString = "";

    constructor(d: any) {











        this.AlertType = d.AlertType;
        this.SendingPeriod = d.SendingPeriod;
    }

}
export function getAlertString(AlertType) {
    let AlertString;
    switch (AlertType) {
        case 101:
            AlertString = "Dépassement de vitesse";
            break;
        case -3:
            AlertString = "Alertes de géofencing";
            break; case -4:
            AlertString = "Sortie de pays";
            break; case -8:
            AlertString = "Sortie d'itinéraire";
            break;
        case 112:
            AlertString = "Alertes de batterie";
            break;
        case 255:
            AlertString = "Alertes de température";
            break;

        case 102:
            AlertString = "Alertes de carburant";
            break;

        case 143:
            AlertString = "Conduite agressive";
            break;
        case 144:
            AlertString = "Bouton SOS";
            break;


        case 146:
            AlertString = "Etat de contact";
            break;

        case 149:
            AlertString = "Etat des portes";
            break;
        case 156:
            AlertString = "Alertes de parc";
            break;

        case 151:
            AlertString = "Alertess de stop";
            break;
        case 153:
            AlertString = "Stop de longue durée";
            break;
        case 1002:
        case 138:

            AlertString = "Remorquage";
            break;

    }
    return AlertString;
}