import MYPROJECTPIC from "@salesforce/resourceUrl/myProjectPic";
import ProjectPreview from "@salesforce/resourceUrl/ProjectPreview";

export const HEADER_DETAILS = {
    projectTitle: "GRANDAIDS",
   // link: "https://www.veraliving.com.au/",
   // label: "Let us be part of your journey home",
   // image: MYPROJECTPIC + "/projectLogo.png"
};

export const PROJECT_SUMMARY = {
    HEADING: "PROJECT SUMMARY",
    DESCRIPTION:
        "As a disabled person, living in a home without any assistance is much more risky than for a normal living person. Vera Living offers a secure and comfortable experience especially for disabled people. Here in Vera Community Hub, a person can call for any type of need for assistance for a living home specially for maintenance for electrical appliances like lamp, refrigerator, TV, washing machine, etc. It also includes review and feedback for the provided services, can store emergency calls, important dates and payment information, “My Neighbourhood” feature where a person can see most rated restaurants, banks, etc. and many more. With the help of Vera Community Hub,, this can be done with just a click.  Below all the features of the Vera Community Hub are given along with details of each interface.",

    KEYS_POINTS: ["Dashboard.", "My neighbourhood.", "Maintenance", "User guide", "Feed back", "SOS emergency"]
};

export const PORTFOLIO = [
    {
        label: "My Profile",
        //image: MYPROJECTPIC + "/projectLogo.png",
        image: ProjectPreview + "/img/portfolio/cabin.png",
        icon: "standard:user",
        description:
            "This feature holds information like emergency contacts , important dates and payment information. The user can also view and rate goals and outcomes from “My Goals” and “My Outcomes”."
    },
    {
        label: "Dashboard",
        //image: MYPROJECTPIC + "/projectLogo.png",
        image: ProjectPreview + "/img/portfolio/cabin.png",
        icon: "standard:dashboard",
        description: "test"
    },
    {
        label: "My neighbourhood",
        // image: MYPROJECTPIC + "/projectLogo.png",
        // image: ProjectPreview + "/img/portfolio/cake.png",
        image: ProjectPreview + "/img/portfolio/circus.png",
        icon: "standard:action_list_component",
        description:
            "Show all the top available restaurants, bank, gym and park near the user’s current location. And click each of them to show the rating details of the particular subjects."
    },
    {
        label: "Maintenance",
        // image: MYPROJECTPIC + "/projectLogo.png",
        image: ProjectPreview + "/img/portfolio/game.png",
        icon: "standard:agent_home",
        description:
            "It contains three issues in total: “smoke alarm”, “sprinkler” and “fire hose”. Each issue contains three types: “Urgent”, “It is broken” and “Need VeraLiving Assistance”. All the issues have a comment section."
    },
    {
        label: "User guide",
        // image: MYPROJECTPIC + "/projectLogo.png",
        image: ProjectPreview + "/img/portfolio/safe.png",
        icon: "standard:asset_relationship",
        description:
            "House guides and manuals have three available guides: “Wifi Password”, “Doorbell and Intercom” and “Control Touch”. Clicking each of them shows details of the manual."
    },
    {
        label: "My Golas",
        // image: MYPROJECTPIC + "/projectLogo.png",
        image: ProjectPreview + "/img/portfolio/submarine.png",
        icon: "standard:budget",
        description:
            "The my goals feature consists of all the goals list with a description with them. Each of the goal’s list with a rating button per goal. All goals can also be reset by the “Rest My Goals” button at the bottom."
    }
];
