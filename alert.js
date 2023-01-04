// Alert.Create('Test')
class Alert {
    static CssClasses = {
        alert: 'alert',
        alertShow: 'alert-show',
        alertContainer: 'alert-container',
        alertFixed: 'alert-container-fixed',
        alertTopLeft: 'alert-container-top-left',
        alertBottomLeft: 'alert-container-bottom-left',
        alertTopRight: 'alert-container-top-right',
        alertTopCenter: 'alert-container-top-center',
        alertBottomCenter: 'alert-container-bottom-center',
        alertBottomRight: 'alert-container-bottom-right',
        alertWrapper: 'alert-wrapper',
        alertStatus: 'alert-status',
        alertSuccess: 'alert-success',
        alertWarning: 'alert-warning',
        alertDanger: 'alert-danger',
        alertInfo: 'alert-info',
        alertIcon: 'alert-icon',
        alertMessageWrapper: 'alert-message-wrapper',
        alertMessage: 'alert-message',
        alertAction: 'alert-action',
        alertClose: 'alert-close'
    };

    static Icons = {
        Exclamation: 'exclamation',
        Warn: 'warn',
        Danger: 'danger',
        Info: 'info',
        Question: 'question',
        QuestionMark: 'question-mark',
        Plus: 'plus',
        Add: 'add'
    };

    static Colors = {
        Success: 'success',
        Green: 'green',
        Warning: 'warning',
        Alert: 'alert',
        Orange: 'orange',
        Danger: 'danger',
        Error: 'error',
        Red: 'red'
    };

    static Positions = {
        BottomLeft: 'bl',
        TopLeft: 'tl',
        TopRight: 'tr',
        TopCenter: 'tc',
        TopMiddle: 'tm',
        MiddleCenter: 'mc',
        BottomCenter: 'bc',
        BottomMiddle: 'bm'
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

    /**
     * Utility Functions
     *
     *  */

    /**(Deprecated) Applies default values to all of the constructor props.*/
    #applyDefaults() {
        this.options.message = this.userOptions?.message ?? 'Operation performed successfully.',
        this.options.dismissible = this.userOptions?.dismissible ?? true;
        this.options.timeout = this.userOptions?.timeout ?? 5000;
        this.options.status = this.userOptions?.status ? this.userOptions.status.toLowerCase().trim() : '';
        this.options.actions = this.userOptions?.actions ?? [];
        this.options.fixed = this.userOptions?.fixed ?? false;
        this.options.position = this.userOptions?.position ?? 'br';
        this.options.container = this.userOptions?.container ?? document.body;
        this.options.width = this.userOptions?.width ?? '250px';
        this.options.speed = this.userOptions?.speed ?? 'medium';
        this.options.icon = this.userOptions?.icon ?? '+';

        return this;
    }

    /**Find the existing container. */
    #setContainer() {
        let target = this.#getOrFindContainer();

        if (target === undefined) {
            console.warn(`Could not find the target container: ${this.options.container}`);

            target = document.body;
        }

        this.container = this.#getOrAddContainerIn(target);
    }

    /**Set the position of the Alert. */
    #setPosition() {
        this.container.classList.add(this.#getPositionCssClass());

        if (this.options.fixed) {
            this.container.classList.add(Alert.CssClasses.alertFixed);
        } else {
            this.container.classList.remove(Alert.CssClasses.alertFixed);
        }
    }

    /**Get the appropriate position class from the options object. */
    #getPositionCssClass() {
        switch(this.options.position) {
            case Alert.Positions.BottomLeft:
                return Alert.CssClasses.alertBottomLeft;
            case Alert.Positions.TopLeft:
                return Alert.CssClasses.alertTopLeft;
            case Alert.Positions.TopRight:
                return Alert.CssClasses.alertTopRight;
            case Alert.Positions.TopCenter:
            case Alert.Positions.TopMiddle:
                return Alert.CssClasses.alertTopCenter;
            case Alert.Positions.BottomCenter:
            case Alert.Positions.BottomMiddle:
                return Alert.CssClasses.alertBottomCenter;
            default:
                return Alert.CssClasses.alertBottomRight;
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

            if (node.nodeType === 1
                && node.classList.length > 0
                && node.classList.contains(Alert.CssClasses.alertContainer)
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
        container.classList.add(Alert.CssClasses.alertContainer);

        if (this.options.fixed) {
            container.classList.add(Alert.CssClasses.alertFixed);
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

        innerAlert.classList.add(Alert.CssClasses.alert, Alert.CssClasses.alertShow);

        this.#applyColorAndIconTo(innerAlert);
        this.#insertMessageTo(innerAlert);
        this.#addActionsTo(innerAlert);
        this.#addDismissButtonTo(innerAlert);

        return innerAlert;
    }

    /**Handles creation of the outer alert element. */
    #createOuterAlert() {
        const outerElement = document.createElement('div');

        outerElement.classList.add(Alert.CssClasses.alertWrapper);
        outerElement.style.height = '0px';
        outerElement.style.opacity = '0';
        outerElement.style.marginTop = '0px';
        outerElement.style.marginBottom = '0px';
        outerElement.style.width = this.options.width;

        this.#setSpeed(outerElement);

        return outerElement;
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
        status.classList.add(Alert.CssClasses.alertStatus);

        this.#applyColorTo(status);
        this.#applyIconTo(status);

        element.appendChild(status);
    }

    /**Applies color to the alert. */
    #applyColorTo(element) {
        switch (this.options.status) {
            case Alert.Colors.Success:
            case Alert.Colors.Green:
                element.classList.add(Alert.CssClasses.alertSuccess);
                break;
            case Alert.Colors.Warning:
            case Alert.Colors.Alert:
            case Alert.Colors.Orange:
                element.classList.add(Alert.CssClasses.alertWarning);
                break;
            case Alert.Colors.Danger:
            case Alert.Colors.Error:
            case Alert.Colors.Red:
                element.classList.add(Alert.CssClasses.alertDanger);
                break;
            default:
                element.classList.add(Alert.CssClasses.alertSuccess);
                break;
        }
    }

    /**Applies an icon to the alert. */
    #applyIconTo(element) {
        if (this.options.icon) return;

        const icon = document.createElement('span');
        icon.classList.add(Alert.CssClasses.alertIcon);

        switch (this.options.icon) {
            case Alert.Icons.Exclamation:
            case Alert.Icons.Warn:
            case Alert.Icons.Danger:
                icon.innerText = '!';
                break;
            case Alert.Icons.Info:
            case Alert.Icons.Question:
            case Alert.Icons.QuestionMark:
                icon.innerText = '?';
                break;
            case Alert.Icons.Plus:
            case Alert.Icons.Add:
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
        this.messageWrapper.classList.add(Alert.CssClasses.alertMessageWrapper);

        this.message = document.createElement('span');
        this.message.classList.add(Alert.CssClasses.alertMessage);
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
        button.classList.add(Alert.CssClasses.alertAction);
        button.textContent = action.text;

        if (typeof action.function === 'function') {
            if (action.dismiss === true) {
                button.onclick = function() {
                    action.function();
                    alert.#close();
                }
            } else {
                button.onclick = action.function;
            }
        } else {
            button.onclick = alert.#close();
        }

        element.appendChild(button);
    }

    /**Adds a dismiss button to the alert. */
    #addDismissButtonTo(element) {
        if (!this.options.dismissible) return;

        const closeButton = document.createElement('span');
        closeButton.classList.add(Alert.CssClasses.alertClose);
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

    /**Private primary methods. */

    #create() {
        //this.#applyDefaults();
        this.#setContainer();
        this.#setPosition();

        this.element = this.#createAlert();
        this.container.appendChild(this.element);

        // // If the timeout property isn't false and it's greater than 0...
        if (this.options.timeout !== false && this.options.timeout > 0) {
            // ...Close the Alert after the given amount of time.
            this.interval = setTimeout(() => { this.#close(); }, this.options.timeout);
        }
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
        console.log(alertTransitions);
        this.element.style.transition = '';

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

        // Wait for the fade out animation before removing the alert container.
        setTimeout(() => { this.container.removeChild(this.element); }, 1000);
    }

    /**Public methods */

    /**Fluent method that sets the container property */
    Container(container) {
        if (container === null || container === undefined) return;

        this.options.container = container;

        return this;
    }

    /**Fluent method that sets the message property. */
    Message(message) {
        if (message === null || message === undefined) return;

        this.options.message = message;

        return this;
    }

    /**Fluent method that sets the dismissible property. */
    Dismissible(dismissible) {
        if (dismissible === null || dismissible === undefined) return;

        this.options.dismissible = dismissible;

        return this;
    }

    /**Fluent method that sets the timeout property. */
    Timeout(timeout) {
        if (timeout === null || timeout === undefined) return;

        this.options.timeout = timeout;

        return this;
    }

    /**Fluent method that sets the status property. */
    Status(status) {
        if (status === null || status === undefined) return;

        this.options.status = status;

        return this;
    }

    /**Fluent method that sets the fixed property. */
    Fixed(fixed) {
        if (fixed === null || fixed === undefined) return;

        this.options.fixed = fixed;

        return this;
    }

    /**Fluent method that sets the position property. */
    Position(position) {
        if (position === null || position === undefined) return;

        this.options.position = position;

        return this;
    }

    /**Fluent method that sets the width property. */
    Width(width) {
        if (width === null || width === undefined) return;

        this.options.width = width;

        return this;
    }

    /**Fluent method that sets the speed property. */
    Speed(speed) {
        if (speed === null || speed === undefined) return;

        this.options.speed = speed;

        return this;
    }

    /**Fluent method that sets the icon property. */
    Icon(icon) {
        if (icon === null || icon === undefined) return;

        this.options.icon = icon;

        return this;
    }

    /**Executes the creation and display of an alert. */
    Execute() {
        this.#create();
        this.#open();
    }

    static Create(msg) {
        return new Alert()
            .Position('br')
            .Message(msg)
            .Width('250px')
            .Container(document.body)
            .Speed('medium')
            .Icon('+')
            .Dismissible(true)
            .Execute()
    }
}

// Set defaults in the template methods only instead of in applyDefaults