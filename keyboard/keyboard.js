const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null,
    },

    properties: {
        value: "",
        capsLock: false,
        shift: false
    },

    init() {
        // Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        // Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard--hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys(num) {
        const fragment = document.createDocumentFragment();
        const keyLayout = 
        ["~","1", "2", "3", "4", "5", "6", "7", "8", "9", "0","-","+","backspace",
        "Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p","[","]","|",
        "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l",";", "'", "enter",
        "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",
        "ctrl", "alt", "space", "alt", "ctrl"]

        // Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            const insertLineBreak = ["backspace", "|", "enter", "/"].indexOf(key) !== -1;

            // Add attributes/classes
            if(key==="Tab" || key==="backspace" || key==="caps" || key==="enter" || key==="shift" || key==="ctrl" || key==="alt" || key==="space"){
                elementCode = 81;
            }
            elementCode = key.charCodeAt();
            keyElement.setAttribute("data", " " + elementCode);
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key");

            if(key==="Tab" || key==="backspace" || key==="caps" || key==="enter" || key==="shift" || key==="ctrl" || key==="alt" || key==="space"){

            }
            else{
                document.onkeydown = function(event){
                    console.log(event.keyCode);
                    console.log(elementCode);
                    document.querySelector('button.keyboard__key[data="'+ event.keyCode +'"]').classList.add('keyboard__key--press');              
                }
            }
            
            elementCode = 113;
            elementCode = key.charCodeAt();

            switch (key) {
                case "Tab":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_tab");
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "   ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "backspace":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = createIconHTML("backspace");

                    keyElement.addEventListener("click", () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent("oninput");
                    });
                    break;

                case "enter":
                    keyElement.classList.add("keyboard__key--med--wide");
                    keyElement.innerHTML = createIconHTML("keyboard_return");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide");
                    keyElement.innerHTML = createIconHTML("space_bar");

                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });

                    break;

                case "caps":
                    keyElement.classList.add("keyboard__key--med--wide", "keyboard__key--activatable");
                    keyElement.innerHTML = createIconHTML("keyboard_capslock");

                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                    });

                    break;
                
                case "shift":
                    keyElement.classList.add("keyboard__key--wide");
                    keyElement.innerHTML = "shift";

                    keyElement.addEventListener("click", () => {
                        this.properties.shift = true;
                    })

                    break;

                case "ctrl":
                    keyElement.classList.add("keyboard__key");
                    keyElement.innerHTML = "ctrl";
                    break;

                case "alt":
                    keyElement.classList.add("keyboard__key");
                    keyElement.innerHTML = "alt";

                    keyElement.addEventListener("click", () => {
                        if(num){
                            num = false;
                        }
                        else{
                            num = true;
                        }
                        this._createKeys(num);
                    })

                    break;

                default:
                    keyElement.textContent = key.toLowerCase(); 

                    keyElement.addEventListener("click", () => {
                        if(this.properties.shift){
                            if(key==="1"){ key="!"}
                            else if(key==="2"){ key="@"}
                            else if(key==="3"){ key="#"}
                            else if(key==="4"){ key="$"}
                            else if(key==="5"){ key="%"}
                            else if(key==="6"){ key="^"}
                            else if(key==="7"){ key="&"}
                            else if(key==="8"){ key="*"}
                            else if(key==="9"){ key="("}
                            else if(key==="0"){ key=")"}
                            else if(key==="-"){ key="_"}
                            else if(key==="="){ key="+"}
                            else if(key==="["){ key="{"}
                            else if(key==="]"){ key="}"}
                            this.properties.value += key.toUpperCase();
                            this._triggerEvent("oninput");
                            this.properties.shift = false;
                        }
                        else{
                            this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                            this._triggerEvent("oninput");
                        }
                    });
                  
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    },

   /* document.onkeypress = function(event){
        document.querySelector('#keyboard .keyboard__keys .keyboard__key[data="'+ event.keyCode +'"]').classList.add('active');
    }, */

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if(key.textContent==="1"){ key.textContent="!"}
                else if(key.textContent==="!"){ key.textContent="1"}
                if(key.textContent==="2"){ key.textContent="@"}
                else if(key.textContent==="@"){ key.textContent="2"}
                if(key.textContent==="3"){ key.textContent="#"}
                else if(key.textContent==="#"){ key.textContent="3"}
                if(key.textContent==="4"){ key.textContent="$"}
                else if(key.textContent==="$"){ key.textContent="4"}
                if(key.textContent==="5"){ key.textContent="%"}
                else if(key.textContent==="%"){ key.textContent="5"}
                if(key.textContent==="6"){ key.textContent="^"}
                else if(key.textContent==="^"){ key.textContent="6"}
                if(key.textContent==="7"){ key.textContent="&"}
                else if(key.textContent==="&"){ key.textContent="7"}
                if(key.textContent==="8"){ key.textContent="*"}
                else if(key.textContent==="*"){ key.textContent="8"}
                if(key.textContent==="9"){ key.textContent="("}
                else if(key.textContent==="("){ key.textContent="9"}
                if(key.textContent==="0"){ key.textContent=")"}
                else if(key.textContent===")"){ key.textContent="0"}
                if(key.textContent==="-"){ key.textContent="_"}
                else if(key.textContent==="_"){ key.textContent="-"}
                if(key.textContent==="="){ key.textContent="+"}
                else if(key.textContent==="+"){ key.textContent="="}
                if(key.textContent==="["){ key.textContent="{"}
                else if(key.textContent==="{"){ key.textContent="["}
                if(key.textContent==="]"){ key.textContent="}"}
                else if(key.textContent==="}"){ key.textContent="]"}
                if(key.textContent==="shift" || key.textContent==="ctrl" || key.textContent==="alt" ){
                    key.textContent = key.textContent.toLowerCase();
                }
                else{
                    key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
                
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },

    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }
};

window.addEventListener("DOMContentLoaded", function () {
    Keyboard.init();
});
