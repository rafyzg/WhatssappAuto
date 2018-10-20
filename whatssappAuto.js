/**
 * Class for using puppeteer to enable whatssapp funciton like -
 * Sending message, sending emoji, blocking a contact, creating a group
 * class is using puppeteer library
 */
const PUPPETEER = require("puppeteer");
class WhatssappAuto {

    /**
     * @param {boolean} headless True means the browser is hidden. False means a live preview
     */
    constructor(headless) {
        this.browser = null;
        this.page = null;
        this.headless = headless;
        this.userDataDir = "C:\Users\Home\AppData\Local\Google\Chrome\User Data";
    }

    /**
   * Uses puppeteer to launch the browser with userDataDir, and user agent
   * @return {boolean} Whether everything succeeded
   */
    async launchBrowser() {
        try {
            this.browser = await PUPPETEER.launch({
                userDataDir: this.userDataDir,
                headless: this.headless,
                args: ["--disable-dev-shm-usage"], //To avoid unnecessary issues
            });
            this.page = await this.browser.newPage();
            await this.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0");
            await this.page.goto('https://web.whatsapp.com', {waitUntil: "domcontentloaded"});
            return true;
        } catch(error) {
            console.log("Failed to launch browser", error);
            return false;
        }
    }

    /**
    * Find an clickes the chat with the contact name
    * @param {string} name A contact name
    * @return {boolean} If everything went well
    */
    async findUserName(name) {
        try {
            await this.page.waitFor("input[type=text]");
            await this.page.focus("input[type=text]");
            for(var i =0;i < 30;i++) { //Makes sure the search bar is clear
                await this.page.keyboard.press("Backspace");
            }
            await this.page.waitFor(1000);
            await this.page.type("input[type=text]", name , { delay: 150 }); //Types the username

            await this.page.waitForSelector("._1AKfk"); //Waiting for Chats
            await this.page.click("._2wP_Y"); //Clickes the first chat
            return true;
        } catch(error) {
            console.log("Couldn't find %s conversation", name);
            return false;
        }
    }

    /**
    * Find an clickes the chat with the contact name
    * @param {string} name A contact name
    * @return {boolean} If everything went well
    */
    async blockPerson(name) {
        if(this.page == null) {
            await this.launchBrowser();
        }
        try {
            await this.findUserName(name);
            await this.page.waitFor(400);

            await this.page.click("._2zCDG");  
            await this.page.waitFor("div._10xEB"); 
            await this.page.click("div._10xEB");//Clicks the block person
            await this.page.waitFor("div[role='button']");
            await this.page.click("div._1WZqU.PNlAR"); //Confirms the block
            await this.page.click("div._1M3wR._3M2St"); //Clears the search bar

            await this.page.waitFor(5000);
            console.log("Successfully blocked contact");
            return true;
        } catch(err) {
            console.log("Couldn't block %s", name);
        }
    }

    /**
    * Invites all the user group
    * @param {array} users array that contains the contact names
    * @return {boolean} If everything went well
    */
    async selectUserGroup(users) {
        try {
            for(let user of users) {
            await this.page.focus("input");
            await this.page.type("input", user , { delay: 150 });
            await this.page.click("div[style='z-index: 0; height: 72px; transform: translateY(0px);']");
            await this.page.waitFor(500);
            }
            return true;
        } catch(error) {
            console.log("There seems to be an issue with on of the contacts");
            return false;
        }
    }

    /**
    * Creates a group with the contact name and the group title
    * @param {array} users array that contains the contact names
    * @param {string} title name of the group
    */
    async createGroup(users, title) {

        if(this.page == null) {
            await this.launchBrowser();
        }
        try {
            await this.page.waitFor("span[data-icon='menu']");
            await this.page.click("span[data-icon='menu']");
            await this.page.click("div[title='New group']");
            await this.page.waitFor(700);
            await this.selectUserGroup(users);

            await this.page.click("span[data-icon='forward-light']"); //Clicks the create group button
            await this.page.waitFor("div._2S1VP.copyable-text.selectable-text");
            await this.page.focus("div._2S1VP.copyable-text.selectable-text");
            await this.page.type("div._2S1VP.copyable-text.selectable-text", title , {delay: 100}); //Sets the Group title

            await this.page.click("div[role='button']");

            return true
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    /**
    * Tags a person \ uses an emoji
    * @param {string} text the tag \ emoji type
    * @return {boolean} If everything went well
    */
    async useTagOrEmoji(text) {
        try {
            await this.page.waitFor("div._2S1VP.copyable-text.selectable-text");
            await this.page.type("div._2S1VP.copyable-text.selectable-text", text , {delay: 100}); //Writes the message
            await this.page.keyboard.press("Enter");
            return true;
        } catch(error) {
            console.log("Failed to use tag / emoji");
            return false;
        }
    }

    /**
    * Types the text of the message
    * @param {string} message the message info
    * @return {boolean} If everything went well
    */
    async typeMessage(message) {
        try {
            await this.page.waitFor("div._2S1VP.copyable-text.selectable-text");
            await this.page.type("div._2S1VP.copyable-text.selectable-text", message.concat(" "), {delay: 100}); //Writes the message
            return true;
        } catch(error) {
            console.log("Failed to type message");
            return false;
        }
    }

    /*
    - @username@ represents a person tag
    - :emoji: represent a emoji type
    * @param {String} txt 
    * @return {array} Array of the text string splited with sections
    */
   analyzeText(txt) {
        var arr = [],
            current = "",
            tag = null,
            smile = null;

        for(var i = 0;i < txt.length;i++) {
            if(txt.charAt(i) == "@" && tag == null) {

                arr.push({text: current, type: "text"});
                current = "";
                tag = "";
                i++;
                
                while(txt.charAt(i) != "@") {
                    tag += txt.charAt(i);
                    i++;
                }

                arr.push({text: tag, type: "tag"});
                tag = null;

            }
            else if(txt.charAt(i) == ":" && smile == null) {
                arr.push({text: current, type: "text"});
                current = "";
                smile = "";
                i++;
                while(txt.charAt(i) != ":") {
                    smile += txt.charAt(i);
                    i++;
                }
                arr.push({text : smile, type: "smile"});
                smile = null;
            }

            else {

                current += txt.charAt(i);
            }

        }
        arr.push({text: current, type: "text"});
        return arr;
    }

    /**
    * Finds the chat and sends message to username
    * @param {string} username the contact name
    * @param {string} text text of the message
    */
    async sendMessage(username, text) {
        if(this.page == null) {
            await this.launchBrowser();
        }
        
        await this.findUserName(username);
        var arr = this.analyzeText(text);
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].text != "") {
                if(arr[i].type == "text") {
                    await this.typeMessage(arr[i].text);
                }
                else if(arr[i].type == "tag") {
                    await this.useTagOrEmoji("@".concat(arr[i].text));
                }
                else {
                    await this.useTagOrEmoji(":".concat(arr[i].text));
                }
            }
        }
        await this.page.waitFor("._35EW6");
        await this.page.click("._35EW6"); //Clicks the send button
        await this.page.click("div._1M3wR._3M2St"); //Clears the search bar

        console.log("Message sent successfully to " + username);
        return true;
    }

    /**
    * Closes the browser
    * @return {boolean} If everything went well
    */
    async close() {
        try { 
            await this.browser.close(); //Closes the Browser
            return true;
        } catch(error) {
            console.log("Failed to close browser");
            return false;
        }
    }

}

module.exports = WhatssappAuto;

/*var who = new WhatssappAuto(false);
who.blockPerson("זוהר הגבר").then((callback) => { 
    if(callback == true) {
        console.log("success");
        who.sendMessage("ניסיון", ":wink::dog:");
        who.close();
    }
    else {
        console.log("error");
    }
});
*/

//var users = ["זוהר ה"];
//who.createGroup(users,"test");
//who.sendMessage("ניסיון", ":wink::dog:");
