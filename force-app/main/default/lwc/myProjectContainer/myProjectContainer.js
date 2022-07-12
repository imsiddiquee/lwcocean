import { LightningElement } from "lwc";
import * as PROJECT_DATA from "./myProjectContainerData";

export default class MyProjectContainer extends LightningElement {
    HEADER_DETAILS = PROJECT_DATA.HEADER_DETAILS;
    PROJECT_SUMMARY = PROJECT_DATA.PROJECT_SUMMARY;
    PORTFOLIO = PROJECT_DATA.PORTFOLIO;
}
