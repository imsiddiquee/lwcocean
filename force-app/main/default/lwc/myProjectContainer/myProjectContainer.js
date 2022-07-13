import { LightningElement } from "lwc";
import * as PROJECT_DATA from "./myProjectContainerData";

/**
 * dependent child component
 * 
 * lwc component 
 * 
 * lightningLoader
 * myProjectHeader
 * myProjectSummary
 * myProjectPortfolio
 * myProjectPortfolioDescription
 * 
 * aura component
 *  
 * BookingFormApp
 * 
 * visualforce page
 * 
 * myProjectPreview
 * 
 
 */
export default class MyProjectContainer extends LightningElement {
    HEADER_DETAILS = PROJECT_DATA.HEADER_DETAILS;
    PROJECT_SUMMARY = PROJECT_DATA.PROJECT_SUMMARY;
    PORTFOLIO = PROJECT_DATA.PORTFOLIO;
}
