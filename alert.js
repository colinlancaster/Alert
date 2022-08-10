// Example new Alert({message: 'Snippet successfully copied!'}).Execute()
class Alert {
    cssClasses = {
        alert: 'js-snackbar',
        alertShow: 'js-snackbar--show',
        alertContainer: 'js-snackbar-container',
        alertFixed: 'js-snackbar-container--fixed',
        alertTopLeft: 'js-snackbar-container--top-left',
        alertBottomLeft: 'js-snackbar-container--bottom-left',
        alertTopRight: 'js-snackbar-container--top-right',
        alertTopCenter: 'js-snackbar-container--top-center',
        alertBottomCenter: 'js-snackbar-container--bottom-center',
        alertBottomRight: 'js-snackbar-container--bottom-right',
        alertBottomLeft: 'js-snackbar-container--bottom-left',
        alertWrapper: 'js-snackbar__wrapper',
        alertStatus: 'js-snackbar__status',
        alertSuccess: 'js-snackbar--success',
        alertWarning: 'js-snackbar--warning',
        alertDanger: 'js-snackbar--danger',
        alertInfo: 'js-snackbar--info',
        alertIcon: 'js-snackbar__icon',
        alertWrapper: 'js-snackbar__message-wrapper',
        alertMessage: 'js-snackbar__message',
        alertAction: 'js-snackbar__action',
        alertClose: 'js-snackbar__close'
    };

    constructor(opts) {
        this.interval;
        this.element = null;
        this.container = '';
        this.message = '';
        this.messageWrapper = '';
        this.options = {};
        this.userOptions = opts;
    }

    #create() {
        this.#applyDefaults();
        this.#setContainer();
        this.#setPosition();

        this.element = this.#createAlert();
        this.container.appendChild(this.element);

        // // If the timeout property isn't false and it's greater than 0...
        if (this.options.timeout !== false && this.options.timeout > 0) {
            // ...Close the Alert after the given amount of time.
            this.interval = setTimeout(() => { this.#close(); }, this.options.timeout); // not this
        }
    }

    /**Applies default values to all of the constructor props.*/
    #applyDefaults() {
        this.options.message = this.userOptions?.message ?? 'Operation performed successfully.',
        this.options.dismissible = this.userOptions?.dismissible ?? true;
        this.options.timeout = this.userOptions?.timeout ?? 2000;
        this.options.status = this.userOptions?.status ? this.userOptions.status.toLowerCase().trim() : '';
        this.options.actions = this.userOptions?.actions ?? [];
        this.options.fixed = this.userOptions?.fixed ?? false;
        this.options.position = this.userOptions?.position ?? 'br';
        this.options.container = this.userOptions?.container ?? document.body;

        // I question these next three
        this.options.width = this.userOptions?.width ?? '250px';
        this.options.speed = this.userOptions?.speed ?? 'medium';
        this.options.icon = this.userOptions?.icon ?? '+';
    }

    #setContainer() {
        let target = this.#getOrFindContainer();

        if (target === undefined) {
            console.warn(`Could not find the target container: ${this.options.container}`);

            target = document.body;
        }

        this.container = this.#getOrAddContainerIn(target);
    }

    /**
     * Utility Functions
     *
     *  */

    #setPosition() {
        this.container.classList.add(this.#getPositionCssClass());

        if (this.options.fixed) {
            this.container.classList.add(this.cssClasses.alertFixed);
        } else {
            this.container.classList.remove(this.cssClasses.alertFixed);
        }
    }
    #getPositionCssClass() {
        switch(this.options.position) {
            case 'bl':
                return this.cssClasses.alertBottomLeft;
            case 'tl':
                return this.cssClasses.alertTopLeft;
            case 'tr':
                return this.cssClasses.alertTopRight;
            case 'tc':
            case 'tm':
                return this.cssClasses.alertTopCenter;
            case 'bc':
            case 'bm':
                return this.cssClasses.alertBottomCenter;
            default:
                return this.cssClasses.alert.alertBottomRight;
        }
    }

    /**If this.options.container is an object, then get it
     * otherwise, find it in the DOM.
     */
    #getOrFindContainer() {
        return typeof this.options.container === 'object'
            ? this.options.container
            : document.getElementById(this.options.container);
    }

    /**Gets the existing alert container or creates one. */
    #getOrAddContainerIn(target) {
        let node;
        const positionClass = this.#getPositionCssClass();

        for (let i = 0; i < target.children.length; i++) {
            node = target.children.item(i);

            if (node.nodeType ===1
                && node.classList.length > 0
                && node.classList.contains(this.cssClasses.alertContainer)
                && node.classList.contains(positionClass)
            ) {
                return node;
            }
        }

        return this.#createContainer(target);
    }

    /**Handles creating the new alert container. */
    #createContainer(target) {
        const container = document.createElement('div');
        container.classList.add(this.cssClasses.alertContainer);

        if (this.options.fixed) {
            container.classList.add(this.cssClasses.alertFixed);
        }

        target.appendChild(container);
        return container;
    }

    /**Handles create of the Alert elements. */
    #createAlert() {
        const outerAlert = this.#createOuterAlert();
        const innerAlert = this.#createInnerAlert();

        outerAlert.appendChild(innerAlert)

        return outerAlert;
    }

    /**Handles creation of the inner alert element. */
    #createInnerAlert() {
        const innerAlert = document.createElement('div');

        innerAlert.classList.add(this.cssClasses.alert, this.cssClasses.alertShow);

        this.#applyColorAndIconTo(innerAlert);
        this.#insertMessageTo(innerAlert);

        // This part is fucked up
        this.#addActionsTo(innerAlert);
        this.#addDismissButtonTo(innerAlert);

        return innerAlert;
    }

    /**Handles creation of the outer alert element. */
    #createOuterAlert() {
        const outerElement = document.createElement('div');

        outerElement.classList.add(this.cssClasses.alertWrapper);
        outerElement.style.height = '0px';
        outerElement.style.opacity = '0';
        outerElement.style.marginTop = '0px';
        outerElement.style.marginBottom = '0px';

        this.#setWidth(outerElement);
        this.#setSpeed(outerElement);

        return outerElement;
    }

    /**Set the width of the outer alert. */
    #setWidth(element) {
        if (!this.options.width) return;

        element.style.width = this.options.width;
    }

    /**Sets the speed at which the alert transitions. */
    #setSpeed(element) {
        const { speed } = this.options;

        switch (typeof speed) {
            case 'number':
                element.style.transitionDuration = speed + 'ms';
                break;
            case 'string':
                element.style.transitionDuration = speed;
                break;
            default:
                break;
        }
    }

    /**Calls `applyColorTo()` and `applyIconTo()`. */
    #applyColorAndIconTo(element) {
        if (this.options.status) return;

        const status = document.createElement('span');
        status.classList.add(this.cssClasses.alertStatus);

        this.#applyColorTo(status);
        this.#applyIconTo(status);

        element.appendChild(status);
    }

    /**Applies color to the alert. */
    #applyColorTo(element) {
        switch (this.options.status) {
            case 'success':
            case 'green':
                element.classList.add(this.cssClasses.alertSuccess);
                break;
            case 'warning':
            case 'alert':
            case 'orange':
                element.classList.add(this.cssClasses.alertWarning);
                break;
            case 'danger':
            case 'error':
            case 'red':
                element.classList.add(this.cssClasses.alertDanger);
                break;
            default:
                element.classList.add(this.cssClasses.alertSuccess);
                break;
        }
    }

    /**Applies an icon to the alert. */
    #applyIconTo(element) {
        if (this.options.icon) return;

        const icon = document.createElement('span');
        icon.classList.add(this.cssClasses.alertIcon);

        switch (this.options.icon) {
            case 'exclamation':
            case 'warn':
            case 'danger':
                icon.innerText = '!';
                break;
            case 'info':
            case 'question':
            case 'question-mark':
                icon.innerText = '?';
                break;
            case 'plus':
            case 'add':
                icon.innerText = '+';
                break;
            default:
                if (this.options.icon.length > 1) {
                    console.warn('Invalid icon character provided: ', this.options.icon);
                }

                icon.innerText = this.options.icon.substr(0, 1);
                break;
        }

        element.appendChild(icon);
    }

    /**Applies message into the alert. */
    #insertMessageTo(element) {
        this.messageWrapper = document.createElement('div');
        this.messageWrapper.classList.add(this.cssClasses.alertWrapper);

        this.message = document.createElement('span');
        this.message.classList.add(this.cssClasses.alertMessage);
        this.message.innerHTML = this.options.message;

        this.messageWrapper.appendChild(this.message);
        element.appendChild(this.messageWrapper);
    }

    /**Adds many actions via `addAction` */
    #addActionsTo(element) {
        if (typeof this.options.actions !== 'object') return;

        for (let i = 0; i < this.options.actions.length; i++) {
            this.#addAction(element, this.options.actions[i], this);
        }
    }

    /**Adds functionality/actions to the alert.
     * E.g. the function that fires when a button
     * in the alert is pressed.
     */
    #addAction(element, action, alert) {
        const button = document.createElement('span');
        button.classList.add(this.cssClasses.alertAction);
        button.textContent = action.text;

        if (typeof action.function === 'function') {
            if (action.dismiss === true) {
                button.onclick = function() {
                    action.function();
                    alert.#close(); // not this
                }
            } else {
                button.onclick = action.function;
            }
        } else {
            console.log('do we get here?')
            button.onclick = alert.#close(); // not this
        }

        element.appendChild(button);
    }

    /**Adds a dismiss button to the alert. */
    #addDismissButtonTo(element) {
        if (!this.options.dismissible) return;
        console.log('From addDismissButtonTo')
        console.dir(this)
        const closeButton = document.createElement('span');
        closeButton.classList.add(this.cssClasses.alertClose);
        closeButton.innerText = '\u00d7';
        closeButton.addEventListener('click', () => { this.#close(); })

        element.appendChild(closeButton);
    }

    /**Retrieves the height of the alert. */
    #getMessageHeight() {
        const wrapperStyles = window.getComputedStyle(this.messageWrapper);

        return this.message.scrollHeight
            + parseFloat(wrapperStyles.getPropertyValue('padding-top'))
            + parseFloat(wrapperStyles.getPropertyValue('padding-bottom'));
    }

    /**Opens the alert. Adds `transitioned` event listener. */
    #open() {
        const contentHeight = this.#getMessageHeight();
        this.element.style.height = contentHeight + 'px';
        this.element.style.opacity = 1;
        this.element.marginTop = '5px';
        this.element.marginBottom = '5px';

        this.element.addEventListener('transitioned', function() {
            this.element.removeEventListener('transitioned', arguments.callee);
            this.element.style.height = null;
        });
    }

    /**Closes the alert. Uses `requestAnimationFrame()` to make it look nice. */
    #close() {
        if (this.interval) clearInterval(this.interval);

        const alertHeight = this.element.scrollHeight;
        const alertTransitions = this.element.style.transition;
        this.element.style.transition = '';
        const that = this;

        requestAnimationFrame(() => {
            this.element.style.height = alertHeight + 'px';
            this.element.style.opacity = 1;
            this.element.style.marginTop = '0px';
            this.element.style.marginBottom = '0px';
            this.element.style.transition = alertTransitions;

            requestAnimationFrame(() => {
                this.element.style.height = '0px';
                this.element.style.opacity = 0;
            });
        });

        //setTimeout(() => { this.container.removeChild(this.element); }, 1000)
    }

    /**Executes the creation and display of an alert. */
    Execute() {
        this.#create();
        this.#open();
    }
}
