IDE_Morph.prototype.createNewProject = function () {
    var myself = this;

    this.confirm(
        'Replace the current project with a new one?',
        'New Project',
        function () {
            if (myself.isArduinoTranslationMode) {
                StageMorph.prototype.blockTemplates = StageMorph.prototype.notSoOriginalBlockTemplates;
                SpriteMorph.prototype.blockTemplates = SpriteMorph.prototype.notSoOriginalBlockTemplates;
                myself.isArduinoTranslationMode = false;
                // show all categories

                myself.categories.children.forEach(function (each) {
                    each.setPosition(each.originalPosition);
                    each.show();
                });

                myself.categories.setHeight(myself.categories.height() + 30);
            }
            myself.newProject();
            IDE_Morph.prototype.ucdrefreshPalette();            
          //  IDE_Morph.prototype.start3drobolab();
        }
    );
};

IDE_Morph.prototype.createStage = function () {
    // assumes that the logo pane has already been created
    if (this.stage) { this.stage.destroy(); }
    StageMorph.prototype.frameRate = 0;
    this.stage = new StageMorph(this.globalVariables);
    this.stage.setExtent(this.stage.dimensions); // dimensions are fixed
    if (this.currentSprite instanceof SpriteMorph) {
        this.currentSprite.setPosition(
            this.stage.center().subtract(
                this.currentSprite.extent().divideBy(2)
            )
        );
        this.stage.add(this.currentSprite);
    }

    //3drobolab ekledi
    IDE_Morph.prototype.orginalstage = this.stage;

    this.add(this.stage);
	
};

IDE_Morph.prototype.createControlBar = function () {
    // assumes the logo has already been created
    var padding = 5,
        button,
        slider,
        stopButton,
        pauseButton,
        startButton,
        projectButton,
        settingsButton,
        stageSizeButton,
        appModeButton,
        steppingButton,
        cloudButton,
        x,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ],
        myself = this;



    if (this.controlBar) {
        this.controlBar.destroy();
    }

    this.controlBar = new Morph();
    this.controlBar.color = this.frameColor;
    this.controlBar.setHeight(this.logo.height()); // height is fixed
    this.controlBar.mouseClickLeft = function () {
        this.world().fillPage();
    };
    this.add(this.controlBar);

    //3drobolab ekledi
    IDE_Morph.prototype.controlBar = this.controlBar;


    //smallStageButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleStageSize',
        [
            new SymbolMorph('smallStage', 14),
            new SymbolMorph('normalStage', 14)
        ],
        function () {  // query
            return myself.isSmallStage;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'stage size\nsmall & normal';
    button.fixLayout();
    button.refresh();
    stageSizeButton = button;
    this.controlBar.add(stageSizeButton);
    this.controlBar.stageSizeButton = button; // for refreshing

    //appModeButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleAppMode',
        [
            new SymbolMorph('fullScreen', 14),
            new SymbolMorph('normalScreen', 14)
        ],
        function () {  // query
            return myself.isAppMode;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'app & edit\nmodes';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    this.controlBar.add(appModeButton);
    this.controlBar.appModeButton = appModeButton; // for refreshing

    //steppingButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleSingleStepping',
        [
            new SymbolMorph('footprints', 16),
            new SymbolMorph('footprints', 16)
        ],
        function () {  // query
            return Process.prototype.enableSingleStepping;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = new Color(153, 255, 213);
    //    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Visible stepping';
    button.fixLayout();
    button.refresh();
    steppingButton = button;
    this.controlBar.add(steppingButton);
    this.controlBar.steppingButton = steppingButton; // for refreshing

    // stopButton
    button = new ToggleButtonMorph(
        null, // colors
        this, // the IDE is the target
        'stopAllScripts',
        [
            new SymbolMorph('octagon', 14),
            new SymbolMorph('square', 14)
        ],
        function () {  // query
            return myself.stage ?
                myself.stage.enableCustomHatBlocks &&
                myself.stage.threads.pauseCustomHatBlocks
                : true;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(200, 0, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'stop\nevery-\nthing';
    button.fixLayout();
    button.refresh();
    stopButton = button;
    this.controlBar.add(stopButton);
    this.controlBar.stopButton = stopButton; // for refreshing

    //pauseButton
    button = new ToggleButtonMorph(
        null, //colors,
        this, // the IDE is the target
        'togglePauseResume',
        [
            new SymbolMorph('pause', 12),
            new SymbolMorph('pointRight', 14)
        ],
        function () {  // query
            return myself.isPaused();
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(255, 220, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'pause/resume\nall scripts';
    button.fixLayout();
    button.refresh();
    pauseButton = button;
    this.controlBar.add(pauseButton);
    this.controlBar.pauseButton = pauseButton; // for refreshing

    // startButton
    button = new PushButtonMorph(
        this,
        'pressStart',
        new SymbolMorph('flag', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'start green\nflag scripts';
    button.fixLayout();
    startButton = button;
    this.controlBar.add(startButton);
    this.controlBar.startButton = startButton;

    // steppingSlider
    slider = new SliderMorph(
        61,
        1,
        Process.prototype.flashTime * 100 + 1,
        6,
        'horizontal'
    );
    slider.action = function (num) {
        Process.prototype.flashTime = (num - 1) / 100;
        myself.controlBar.refreshResumeSymbol();
    };
    // slider.alpha = MorphicPreferences.isFlat ? 0.1 : 0.3;
    slider.color = new Color(153, 255, 213);
    slider.alpha = 0.3;
    slider.setExtent(new Point(50, 14));
    this.controlBar.add(slider);
    this.controlBar.steppingSlider = slider;

    // projectButton
    button = new PushButtonMorph(
        this,
        'projectMenu',
        new SymbolMorph('file', 14)
        //'\u270E'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'open, save, & annotate project';
    button.fixLayout();
    projectButton = button;
    this.controlBar.add(projectButton);
    this.controlBar.projectButton = projectButton; // for menu positioning

    // settingsButton
    button = new PushButtonMorph(
        this,
        'settingsMenu',
        new SymbolMorph('gears', 14)
        //'\u2699'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'edit settings';
    button.fixLayout();
    settingsButton = button;
    this.controlBar.add(settingsButton);
    this.controlBar.settingsButton = settingsButton; // for menu positioning

    // cloudButton
    button = new PushButtonMorph(
        this,
        'cloudMenu',
        new SymbolMorph('cloud', 11)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    // button.hint = 'cloud operations';
    button.fixLayout();
    cloudButton = button;
    this.controlBar.add(cloudButton);
    this.controlBar.cloudButton = cloudButton; // for menu positioning

    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        [stopButton, pauseButton, startButton].forEach(
            function (button) {
                button.setCenter(myself.controlBar.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = Math.min(
            startButton.left() - (3 * padding + 2 * stageSizeButton.width()),
            myself.right() - StageMorph.prototype.dimensions.x *
            (myself.isSmallStage ? myself.stageRatio : 1)
        );
        [stageSizeButton, appModeButton].forEach(
            function (button) {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

        slider.setCenter(myself.controlBar.center());
        slider.setRight(stageSizeButton.left() - padding);

        steppingButton.setCenter(myself.controlBar.center());
        steppingButton.setRight(slider.left() - padding);

        settingsButton.setCenter(myself.controlBar.center());
        settingsButton.setLeft(this.left());

        cloudButton.setCenter(myself.controlBar.center());
        cloudButton.setRight(settingsButton.left() - padding);

        projectButton.setCenter(myself.controlBar.center());
        projectButton.setRight(cloudButton.left() - padding);

        this.refreshSlider();
        this.updateLabel();
    };

    this.controlBar.refreshSlider = function () {
        if (Process.prototype.enableSingleStepping && !myself.isAppMode) {
            slider.drawNew();
            slider.show();
        } else {
            slider.hide();
        }
        this.refreshResumeSymbol();
    };

    this.controlBar.refreshResumeSymbol = function () {
        var pauseSymbols;
        if (Process.prototype.enableSingleStepping &&
            Process.prototype.flashTime > 0.5) {
            myself.stage.threads.pauseAll(myself.stage);
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('stepForward', 14)
            ];
        } else {
            pauseSymbols = [
                new SymbolMorph('pause', 12),
                new SymbolMorph('pointRight', 14)
            ];
        }
        pauseButton.labelString = pauseSymbols;
        pauseButton.createLabel();
        pauseButton.fixLayout();
        pauseButton.refresh();
    };

    this.controlBar.updateLabel = function () {
        var suffix = myself.world().isDevMode ?
            ' - ' + localize('development mode') : '';

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.label = new StringMorph(
            (myself.projectName || localize('untitled')) + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.label.color = myself.buttonLabelColor;
        this.label.drawNew();
        this.add(this.label);
        this.label.setCenter(this.center());
        this.label.setLeft(this.settingsButton.right() + 50);
    };
	//IDE_Morph.prototype.ucdrefreshPalette();
};

IDE_Morph.prototype.buildPanes = function () {
    this.createLogo();
    this.createControlBar();
    this.createCategories();
    this.createPalette();
    this.createStage();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.createCorralBar();
    this.createCorral();

    //3drobolab ekledi
    IDE_Morph.prototype.start3drobolab();
};

IDE_Morph.prototype.openIn = function (world) {
    var hash, myself = this, urlLanguage = null;

    //3drobolab eklenti
    IDE_Morph.prototype.myself = this;
    IDE_Morph.prototype.orginalworld = world;

    SnapCloud.initSession(
        function (username) {
            if (username) {
                myself.source = 'cloud';
            }
        }
    );

    this.buildPanes();
    world.add(this);
    world.userMenu = this.userMenu;

    // override SnapCloud's user message with Morphic
    SnapCloud.message = function (string) {
        var m = new MenuMorph(null, string),
            intervalHandle;
        m.popUpCenteredInWorld(world);
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, 2000);
    };

    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph ||
            (morph instanceof MenuMorph))) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };

    this.reactToWorldResize(world.bounds);

    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            throw new Error('unable to retrieve ' + url);
        } catch (err) {
            myself.showMessage('unable to retrieve project');
            return '';
        }
    }

    function applyFlags(dict) {
        if (dict.embedMode) {
            myself.setEmbedMode();
        }
        if (dict.editMode) {
            myself.toggleAppMode(false);
        } else {
            myself.toggleAppMode(true);
        }
        if (!dict.noRun) {
            myself.runScripts();
        }
        if (dict.hideControls) {
            myself.controlBar.hide();
            window.onbeforeunload = nop;
        }
        if (dict.noExitWarning) {
            window.onbeforeunload = nop;
        }
    }

    // dynamic notifications from non-source text files
    // has some issues, commented out for now


    function interpretUrlAnchors() {
        var dict, idx;

        if (location.hash.substr(0, 6) === '#open:') {
            hash = location.hash.substr(6);
            if (hash.charAt(0) === '%'
                || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (contains(
                ['project', 'blocks', 'sprites', 'snapdata'].map(
                    function (each) {
                        return hash.substr(0, 8).indexOf(each);
                    }
                ),
                1
            )) {
                this.droppedText(hash);
            } else {
                this.droppedText(getURL(hash));
            }
        } else if (location.hash.substr(0, 5) === '#run:') {
            hash = location.hash.substr(5);
            idx = hash.indexOf("&");
            if (idx > 0) {
                hash = hash.slice(0, idx);
            }
            if (hash.charAt(0) === '%'
                || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (hash.substr(0, 8) === '<project>') {
                this.rawOpenProjectString(hash);
            } else {
                this.rawOpenProjectString(getURL(hash));
            }
            applyFlags(SnapCloud.parseDict(location.hash.substr(5)));
        } else if (location.hash.substr(0, 9) === '#present:') {
            this.shield = new Morph();
            this.shield.color = this.color;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = SnapCloud.parseDict(location.hash.substr(9));
            dict.Username = dict.Username.toLowerCase();

            SnapCloud.getPublicProject(
                dict.ProjectName,
                dict.Username,
                function (projectData) {
                    var msg;
                    myself.nextSteps([
                        function () {
                            msg = myself.showMessage('Opening project...');
                        },
                        function () { nop(); }, // yield (bug in Chrome)
                        function () {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                            ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        function () {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            applyFlags(dict);
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 7) === '#cloud:') {
            this.shield = new Morph();
            this.shield.alpha = 0;
            this.shield.setExtent(this.parent.extent());
            this.parent.add(this.shield);
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = SnapCloud.parseDict(location.hash.substr(7));

            SnapCloud.getPublicProject(
                dict.ProjectName,
                dict.Username,
                function (projectData) {
                    var msg;
                    myself.nextSteps([
                        function () {
                            msg = myself.showMessage('Opening project...');
                        },
                        function () { nop(); }, // yield (bug in Chrome)
                        function () {
                            if (projectData.indexOf('<snapdata') === 0) {
                                myself.rawOpenCloudDataString(projectData);
                            } else if (
                                projectData.indexOf('<project') === 0
                            ) {
                                myself.rawOpenProjectString(projectData);
                            }
                            myself.hasChangedMedia = true;
                        },
                        function () {
                            myself.shield.destroy();
                            myself.shield = null;
                            msg.destroy();
                            myself.toggleAppMode(false);
                        }
                    ]);
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 4) === '#dl:') {
            myself.showMessage('Fetching project\nfrom the cloud...');

            // make sure to lowercase the username
            dict = SnapCloud.parseDict(location.hash.substr(4));
            dict.Username = dict.Username.toLowerCase();

            SnapCloud.getPublicProject(
                dict.ProjectName,
                dict.Username,
                function (projectData) {
                    myself.saveXMLAs(projectData, dict.ProjectName);
                    myself.showMessage(
                        'Saved project\n' + dict.ProjectName,
                        2
                    );
                },
                this.cloudError()
            );
        } else if (location.hash.substr(0, 6) === '#lang:') {
            urlLanguage = location.hash.substr(6);
            this.setLanguage(urlLanguage);
            this.loadNewProject = true;
        } else if (location.hash.substr(0, 7) === '#signup') {
            this.createCloudAccount();
        }
        this.loadNewProject = false;

    }

    if (this.userLanguage) {
        this.loadNewProject = true;
        this.setLanguage(this.userLanguage, interpretUrlAnchors);
    } else {
        interpretUrlAnchors.call(this);
    }

   // IDE_Morph.prototype.start3drobolab();
};


IDE_Morph.prototype.add3drobomenu = function ()
{
    var myself = IDE_Morph.prototype;
     
    var button,
        ucdrobolabbutton,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    try {
        //emre
        button = new PushButtonMorph(
            this,
            'ucrobolabmenu',
            new SymbolMorph('robot', 14)
        );
        button.corner = 12;
        button.color = colors[0];
        button.highlightColor = colors[1];
        button.pressColor = colors[2];
        button.labelMinExtent = new Point(36, 18);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = new Color(0, 200, 0);
        button.contrast = this.buttonContrast;
        button.drawNew();
        // button.hint = 'start green\nflag scripts';
        button.fixLayout();
        ucdrobolabbutton = button;

        IDE_Morph.prototype.controlBar.add(ucdrobolabbutton);
        IDE_Morph.prototype.controlBar.ucdrobolabbutton = ucdrobolabbutton; // for refreshing

        ucdrobolabbutton.setCenter(IDE_Morph.prototype.controlBar.center());
        ucdrobolabbutton.setRight(89);
    }
    catch (err) { alert(err); }
}

Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

IDE_Morph.prototype.ucdlib = new Array();
IDE_Morph.prototype.ucrobolabmenu = function ()
{
    try {
        //alert('emre222');
        //alert('local:' + localStorage['-ucdrobolab-']);

        var myself = IDE_Morph.prototype.myself,
            world = IDE_Morph.prototype.orginalworld,
            pos = IDE_Morph.prototype.controlBar.ucdrobolabbutton.bottomLeft();


        IDE_Morph.prototype.ucdmenu = new MenuMorph(this);

        function addPreference(label, toggle, test) {
            var on = '\u2611 ',
                off = '\u2610 ';
            IDE_Morph.prototype.ucdmenu.addItem(
                (test ? on : off) + localize(label),
                toggle
            );

        }

        IDE_Morph.prototype.ucdmenu.addItem("Import Library", function () {
            var inp = document.createElement('input');
            if (myself.filePicker) {
                document.body.removeChild(myself.filePicker);
                myself.filePicker = null;
            }
            inp.type = 'file';
            inp.style.color = "transparent";
            inp.style.backgroundColor = "transparent";
            inp.style.border = "none";
            inp.style.outline = "none";
            inp.style.position = "absolute";
            inp.style.top = "0px";
            inp.style.left = "0px";
            inp.style.width = "0px";
            inp.style.height = "0px";
            inp.style.display = "none";
            inp.addEventListener(
                "change",
                function () {
                    document.body.removeChild(inp);
                    myself.filePicker = null;
					//world.hand.processDrop(inp.files);
					var frd = new FileReader();                       
					frd.onloadend = function (e) {                           
						//  alert(e.target.result)
						IDE_Morph.prototype.ucdaddlibrary(inp.files[0].name.split('.xml')[0], e.target.result);

						IDE_Morph.prototype.ucdgetLibrary(inp.files[0].name.split('.xml')[0]);
						IDE_Morph.prototype.ucdsetlibrarystat(IDE_Morph.prototype.ucdgetlibrarieslist().length - 2, true);

					//alert(localStorage['-ucdrobolab-libs-']);
					};
					frd.readAsText(inp.files[0]);     
                },
                false
            );
            document.body.appendChild(inp);
            myself.filePicker = inp;
            inp.click();
        });
       

        IDE_Morph.prototype.ucdmenu.addItem("Download Libraries", function () {

            function isEmpty(value) {
                return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
            }
            try {
                var myself = IDE_Morph.prototype.myself;
                ucdLibraryImportDialogMorph.prototype.liburl = 'https://raw.githubusercontent.com/karabakla/Snap4ArduinoLibrarires/master';
                var libs = ucdLibraryImportDialogMorph.prototype.getURL('LIBRARIES');
                if (!isEmpty(libs)) {
                    var libraries = myself.parseResourceFile(libs);
                    new ucdLibraryImportDialogMorph(IDE_Morph.prototype.myself, libraries).popUp();
                }
                else
                    alert('Connection Error');

            } catch (err) { alert('Connection Error'); }
        });

        IDE_Morph.prototype.ucdmenu.addItem("Export Selected Libraries", function () {

            function isEmpty(value) {
                return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
            }

            for (var i = 0; i < IDE_Morph.prototype.ucdgetlibrarieslist().length; i++) {
                if (!isEmpty(IDE_Morph.prototype.ucdgetlibrarieslist()[i])) {
                    
                    if (IDE_Morph.prototype.ucdgetlibrarystat(i)) {                       
                        try {
                            myself.saveFileAs(localStorage['-ucdrobolab-libs-' + IDE_Morph.prototype.ucdgetlibrarieslist()[i]], 'text/xml;chartset=utf-8', IDE_Morph.prototype.ucdgetlibrarieslist()[i]);                            
                        } catch (err) { alert('export: ' + err); };
                    }
                }
                else
                    break;
            }
        });

        IDE_Morph.prototype.ucdmenu.addItem("Delete Selected Libraries", function ()
        {
            IDE_Morph.prototype.myself.confirm(
                '          Are you sure?        ',
                'Delete Selected Libraries',
                function () {
                    IDE_Morph.prototype.ucddeletelibrary();
                    IDE_Morph.prototype.ucdrefreshPalette();
                }
            );
        });

        IDE_Morph.prototype.ucdmenu.addItem("Delete All Libraries",
            function ()
            {
                IDE_Morph.prototype.myself.confirm(
                    '          Are you sure?        ',
                    'Delete ALL Libraries',
                    function () {
                        IDE_Morph.prototype.ucddeletealllibraries();
                        IDE_Morph.prototype.ucdrefreshPalette();
                    }
                );
            }
        );

        IDE_Morph.prototype.ucdmenu.addItem("Unselect All Libraries",
            function () {
                function isEmpty(value) {
                    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
                }
                for (var i = 0; i < IDE_Morph.prototype.ucdgetlibrarieslist().length; i++) {
                    if (!isEmpty(IDE_Morph.prototype.ucdgetlibrarieslist()[i])) {                        
                        if (IDE_Morph.prototype.ucdgetlibrarystat(i)) {
                            IDE_Morph.prototype.ucdsetlibrarystat(i, false);
                        }
                    }
                    else
                        break;
                }
                IDE_Morph.prototype.ucdrefreshPalette();

            }
        );

        IDE_Morph.prototype.ucdmenu.addLine();


        /*this.getURL(
            this.resourceURL('libraries/LIBRARIES'),
            function (txt) {
                var myarray = txt.split('\n');
                var num = 0;
               myarray.forEach(function (element) {
                   //alert(element.split('.')[0]);
                   if (IDE_Morph.prototype.ucdlib[num] == null)
                   IDE_Morph.prototype.ucdlib[num] = false;
                   try {
                       addPreference(element.split('.xml')[0], function () {
                           
                           var index = myarray.indexOf(element);
                           var stat = IDE_Morph.prototype.ucdlib[index];
                           IDE_Morph.prototype.ucdlib[index] = !stat;

                           if (IDE_Morph.prototype.ucdlib[index])
                               IDE_Morph.prototype.myself.showMessage('Importing Blocks...', 1)

                           IDE_Morph.prototype.ucdrefreshPalette();

                       }, IDE_Morph.prototype.ucdlib[num++]);
                   } catch (err) { alert(err); }
               });
               IDE_Morph.prototype.ucdmenu.popup(world, pos);
            }
        );*/        

        try {
            var num = 0;
            IDE_Morph.prototype.ucdgetlibrarieslist().forEach(function (libname) {

                function isEmpty(value) {
                    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
                }

                if (!isEmpty(libname))
                {
                    //alert(libname);
                    
                    addPreference(libname, function ()
                    {
                        if (libname.indexOf('#') > -1)
                            libname = libname.replace(new RegExp('#', 'g'), ' ');

                        var index = IDE_Morph.prototype.ucdgetlibrarieslist().indexOf(libname);
                        //IDE_Morph.prototype.ucdlib[index] = !IDE_Morph.prototype.ucdlib[index];
                        if (IDE_Morph.prototype.ucdgetlibrarystat(index))
                            IDE_Morph.prototype.ucdsetlibrarystat(index, false);
                        else
                            IDE_Morph.prototype.ucdsetlibrarystat(index, true);

                       // alert('ucdlib:' + IDE_Morph.prototype.ucdgetlibrarystat(index) + ' index: ' + index);

                        if (IDE_Morph.prototype.ucdgetlibrarystat(index))
                            IDE_Morph.prototype.myself.showMessage('Importing: ' + libname, 3)

                        IDE_Morph.prototype.ucdrefreshPalette();

                    }, IDE_Morph.prototype.ucdgetlibrarystat(IDE_Morph.prototype.ucdgetlibrarieslist().indexOf(libname)))

                    //alert(localStorage['-ucdrobolab-libs-' + lib]);
                }
            });
        }
        catch (err) { }
        IDE_Morph.prototype.ucdmenu.popup(world, pos);
    }
    catch (err) { alert(err); }
}


//librartmoprh
var ucdLibraryImportDialogMorph;
ucdLibraryImportDialogMorph.prototype = new DialogBoxMorph();
ucdLibraryImportDialogMorph.prototype.constructor = ucdLibraryImportDialogMorph;
ucdLibraryImportDialogMorph.uber = DialogBoxMorph.prototype;

function ucdLibraryImportDialogMorph(ide, librariesData) {
    this.init(ide, librariesData);
}

ucdLibraryImportDialogMorph.prototype.init = function (ide, librariesData) {
    // initialize inherited properties:
    ucdLibraryImportDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null  // environment
    );

    this.ide = ide;
    this.key = 'downloadLibrary';
    this.librariesData = librariesData; // [{name: , fileName: , description:}]

    // I contain a cached version of the libaries I have displayed,
    // because users may choose to explore a library many times before
    // importing.
    this.libraryCache = {}; // {fileName: [blocks-array] }

    this.handle = null;
    this.listField = null;
    this.palette = null;
    this.notesText = null;
    this.notesField = null;

    this.labelString = 'Download Libraries';
    this.createLabel();

    this.buildContents();
};

ucdLibraryImportDialogMorph.prototype.buildContents = function () {
    this.addBody(new Morph());
    this.body.color = this.color;

    this.initializePalette();
    this.initializeLibraryDescription();
    this.installLibrariesList();

    this.addButton('downloadLibrary', 'Download');
    this.addButton('cancel', 'Cancel');

    this.setExtent(new Point(460, 455));
    this.fixLayout();
};

ucdLibraryImportDialogMorph.prototype.initializePalette = function () {
    // I will display a scrolling list of blocks.
    if (this.palette) { this.palette.destroy(); }

    this.palette = new ScrollFrameMorph(
        null,
        null,
        SpriteMorph.prototype.sliderColor
    );
    this.palette.color = SpriteMorph.prototype.paletteColor;
    this.palette.padding = 4;
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = false;
    this.palette.contents.acceptsDrops = false;

    this.body.add(this.palette);
};

ucdLibraryImportDialogMorph.prototype.initializeLibraryDescription = function () {
    if (this.notesField) { this.notesField.destroy(); }

    this.notesField = new ScrollFrameMorph();
    this.notesField.fixLayout = nop;

    this.notesField.edge = InputFieldMorph.prototype.edge;
    this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
    this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.notesField.contrast = InputFieldMorph.prototype.contrast;
    this.notesField.drawNew = InputFieldMorph.prototype.drawNew;
    this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.notesField.acceptsDrops = false;
    this.notesField.contents.acceptsDrops = false;

    this.notesText = new TextMorph('');

    this.notesField.isTextLineWrapping = true;
    this.notesField.padding = 3;
    this.notesField.setContents(this.notesText);
    this.notesField.setHeight(100);

    this.body.add(this.notesField);
};

ucdLibraryImportDialogMorph.prototype.installLibrariesList = function () {
    var myself = this;

    if (this.listField) { this.listField.destroy(); }

    this.listField = new ListMorph(
        this.librariesData,
        function (element) { return element.name; },
        null,
        function () { myself.importLibrary(); }
    );

    this.fixListFieldItemColors();

    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = function (item) {
        if (isNil(item)) { return; }

        myself.notesText.text = item.description || '';
        myself.notesText.drawNew();
        myself.notesField.contents.adjustBounds();

        //ucdLibraryImportDialogMorph.prototype.itemname = item.fileName.split('.xml')[0];
        ucdLibraryImportDialogMorph.prototype.itemname = item.name;
        ucdLibraryImportDialogMorph.prototype.itemfilename = item.fileName;
        /*if (myself.hasCached(item.fileName)) {
            myself.displayBlocks(item.fileName);
        } else {*/
            myself.showMessage(
                localize('Loading') + '\n' + localize(item.name)
            );

            var libraryXML = ucdLibraryImportDialogMorph.prototype.getURL(item.fileName);
            myself.cacheLibrary(
                item.fileName,
                myself.ide.serializer.loadBlocks(libraryXML)
            );
            myself.displayBlocks(item.fileName);
        //}
    };

    this.listField.setWidth(200);
    this.body.add(this.listField);

    this.fixLayout();
};

ucdLibraryImportDialogMorph.prototype.popUp = function () {
    var world = this.ide.world();
    if (world) {
        ucdLibraryImportDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            400,
            500,
            this.corner,
            this.corner
        );
    }
};

ucdLibraryImportDialogMorph.prototype.fixListFieldItemColors =
    ProjectDialogMorph.prototype.fixListFieldItemColors;

ucdLibraryImportDialogMorph.prototype.clearDetails =
    ProjectDialogMorph.prototype.clearDetails;

ucdLibraryImportDialogMorph.prototype.fixLayout = function () {
    var titleHeight = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
            titleHeight + this.padding
        )));
        this.body.setExtent(new Point(
            this.width() - this.padding * 2,
            this.height()
            - this.padding * 3 // top, bottom and button padding.
            - titleHeight
            - this.buttons.height()
        ));

        this.listField.setExtent(new Point(
            200,
            this.body.height()
        ));
        this.notesField.setExtent(new Point(
            this.body.width() - this.listField.width() - thin,
            100
        ));
        this.palette.setExtent(new Point(
            this.notesField.width(),
            this.body.height() - this.notesField.height() - thin
        ));
        this.listField.contents.children[0].adjustWidths();

        this.listField.setPosition(this.body.position());
        this.palette.setPosition(this.listField.topRight().add(
            new Point(thin, 0)
        ));
        this.notesField.setPosition(this.palette.bottomLeft().add(
            new Point(0, thin)
        ));
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(
            this.top() + (titleHeight - this.label.height()) / 2
        );
    }

    if (this.buttons) {
        this.buttons.fixLayout();
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    Morph.prototype.trackChanges = oldFlag;
    this.changed();
};

// Library Cache Utilities.
ucdLibraryImportDialogMorph.prototype.hasCached = function (key) {
    return this.libraryCache.hasOwnProperty(key);
};

ucdLibraryImportDialogMorph.prototype.cacheLibrary = function (key, blocks) {
    this.libraryCache[key] = blocks;
};

ucdLibraryImportDialogMorph.prototype.cachedLibrary = function (key) {
    return this.libraryCache[key];
};

ucdLibraryImportDialogMorph.prototype.downloadLibrary = function () {

    //alert(ucdLibraryImportDialogMorph.prototype.libraryXML);
    //if (ucdLibraryImportDialogMorph.prototype.itemname.indexOf(' ') > -1)
    //ucdLibraryImportDialogMorph.prototype.itemname = ucdLibraryImportDialogMorph.prototype.itemname.replace(new RegExp(' ', 'g'), '#');
    var libraryXML = ucdLibraryImportDialogMorph.prototype.getURL(ucdLibraryImportDialogMorph.prototype.itemfilename);
    //alert(ucdLibraryImportDialogMorph.prototype.itemfilename);
    //   alert(ucdLibraryImportDialogMorph.prototype.cachedLibrary(ucdLibraryImportDialogMorph.prototype.itemfilename));
    IDE_Morph.prototype.ucdaddlibrary(ucdLibraryImportDialogMorph.prototype.itemfilename.split('.xml')[0], libraryXML);
    IDE_Morph.prototype.ucdgetLibrary(ucdLibraryImportDialogMorph.prototype.itemfilename.split('.xml')[0]);
    IDE_Morph.prototype.ucdsetlibrarystat(IDE_Morph.prototype.ucdgetlibrarieslist().length - 2, true);
    this.destroy();
};

ucdLibraryImportDialogMorph.prototype.displayBlocks = function (libraryKey) {
    var x, y, blockImage, previousCategory, blockContainer,
        myself = this,
        padding = 4,
        blocksList = this.cachedLibrary(libraryKey);

    if (!blocksList.length) { return; }
    // populate palette, grouped by categories.
    this.initializePalette();
    x = this.palette.left() + padding;
    y = this.palette.top();

    SpriteMorph.prototype.categories.forEach(function (category) {
        blocksList.forEach(function (definition) {
            if (definition.category !== category) { return; }
            if (category !== previousCategory) {
                y += padding;
            }
            previousCategory = category;

            blockImage = definition.templateInstance().fullImage();
            blockContainer = new Morph();
            blockContainer.setExtent(
                new Point(blockImage.width, blockImage.height)
            );
            blockContainer.image = blockImage;
            blockContainer.setPosition(new Point(x, y));
            myself.palette.addContents(blockContainer);

            y += blockContainer.fullBounds().height() + padding;
        });
    });

    this.palette.scrollX(padding);
    this.palette.scrollY(padding);
    this.fixLayout();
};

ucdLibraryImportDialogMorph.prototype.showMessage = function (msgText) {
    var msg = new MenuMorph(null, msgText);
    this.initializePalette();
    this.fixLayout();
    msg.popUpCenteredInWorld(this.palette.contents);
};

ucdLibraryImportDialogMorph.prototype.getURL = function (url)
{
    try {
        url = ucdLibraryImportDialogMorph.prototype.liburl + '/' + url;
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send();
        if (request.status === 200) {
            return request.responseText;
        }
        throw new Error('unable to retrieve ' + url);
    } catch (err) {
        throw new Error('unable to retrieve project');
        return '';
    }
}

///

IDE_Morph.prototype.ucddeletepallate = function ()
{
    var mblocks = IDE_Morph.prototype.orginalstage.globalBlocks;
    mblocks.remove(0, mblocks.length);

    IDE_Morph.prototype.myself.flushPaletteCache();
    IDE_Morph.prototype.myself.refreshPalette();
}

IDE_Morph.prototype.ucdrefreshPalette = function () {    

    try {
        IDE_Morph.prototype.ucddeletepallate();
    } catch (err) { }

    function isEmpty(value) {
        return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
    }
    try {
        for (var i = 0; i < IDE_Morph.prototype.ucdgetlibrarieslist().length; i++) {
            if (!isEmpty(IDE_Morph.prototype.ucdgetlibrarieslist()[i])) {
                //alert(IDE_Morph.prototype.ucdgetlibrarystat(i) + ' :emre: ' + i);
                if (IDE_Morph.prototype.ucdgetlibrarystat(i)) {
                    //    IDE_Morph.prototype.ucdlib[i] = IDE_Morph.prototype.ucdgetlibrarystat(i);
                    IDE_Morph.prototype.ucdgetLibrary(IDE_Morph.prototype.ucdgetlibrarieslist()[i]);
                }
            }
            else 
                break;
        }
    } catch (err) { }

    /*
    IDE_Morph.prototype.ucdlib.forEach(function (stat) {
        if (stat) {
            try {
                IDE_Morph.prototype.ucdlib[num] = IDE_Morph.prototype.ucdgetlibrarystat(num);

                alert("num"+num+" , "+IDE_Morph.prototype.ucdgetlibrarystat(num));

                if (IDE_Morph.prototype.ucdlib[num])
                    
           }
            catch (err) { }
        }
        num++;
    });
    */
}

IDE_Morph.prototype.ucdgetLibrary = function (name) {
    var myself = IDE_Morph.prototype.myself,
        stage = IDE_Morph.prototype.orginalstage;
    if (name.indexOf(' ') > -1)
        name = name.replace(new RegExp(' ', 'g'), '#');
    try {
        // var blocks = IDE_Morph.prototype.orginalserializer.loadBlocks(localStorage['-ucdrobolab-libs-' + name], myself.stage);
        this.serializer = new SnapSerializer();
        var blocks = this.serializer.loadBlocks(localStorage['-ucdrobolab-libs-' + name], myself.stage)
        blocks.forEach(function (def) {
            def.receiver = myself.stage;
            myself.stage.globalBlocks.push(def);
            myself.stage.replaceDoubleDefinitionsFor(def);
        });
        myself.flushPaletteCache();
        myself.refreshPalette();
    } catch (err) {
        myself.droppedText(localStorage['-ucdrobolab-libs-' + name], name);
       // alert("err2: " + err);
    }

}

IDE_Morph.prototype.ucdaddlibrary = function (name, libdata) {

    if (name.indexOf(' ') > -1)
        name = name.replace(new RegExp(' ', 'g'), '#');


    var index = -1;
    try { index = IDE_Morph.prototype.ucdgetlibrarieslist().indexOf(name); }
    catch (err) { index = -1; }

    if (index == -1) {
        if (typeof localStorage['-ucdrobolab-libs-'] == 'undefined')
            localStorage['-ucdrobolab-libs-'] = name + ',';
        else
            localStorage['-ucdrobolab-libs-'] += name + ',';
    }
    else
        IDE_Morph.prototype.myself.showMessage('Updating: '+name, 1)
    if (name.indexOf(' ') > -1)
        name = name.replace(' ', '#');
    localStorage['-ucdrobolab-libs-' + name] = libdata;
    //alert('libdata: '+'name: '+name + '\n'+localStorage['-ucdrobolab-libs-' + name]);
}

IDE_Morph.prototype.ucdgetlibrarieslist = function ()
{
    return localStorage['-ucdrobolab-libs-'].split(',');
}

IDE_Morph.prototype.ucddeletelibrary = function () {

    function isEmpty(value) {
        return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
    }

    try {
        var my_libs = IDE_Morph.prototype.ucdgetlibrarieslist();
        for (var i = 0; i < my_libs.length; i++) {
            var name = my_libs[i];
            if (!isEmpty(name)) {
                if (IDE_Morph.prototype.ucdgetlibrarystat(i)) {
                    my_libs.remove(i);
                    IDE_Morph.prototype.ucdsetlibrarystat(i, false);
                    delete localStorage['-ucdrobolab-libs-' + name];
                }
            }
            else
                break;
        }
        localStorage['-ucdrobolab-libs-'] = my_libs.join(',');
       // alert(my_libs.join(','));
    } catch (err) { alert(err); }
    /*
    for (var i = 0; i < IDE_Morph.prototype.ucdgetlibrarieslist().length; i++) {
        var my_libs = IDE_Morph.prototype.ucdgetlibrarieslist();
        var name = my_libs[i];
        alert(name);
        if (IDE_Morph.prototype.ucdgetlibrarystat(i)) {
           
            my_libs.remove(i);
            delete localStorage['-ucdrobolab-libs-' + name];
            IDE_Morph.prototype.ucdlib[i] = false;
        }
        alert(my_libs.join(','));
        localStorage['-ucdrobolab-libs-'] = my_libs.join(',');
    }*/
}

IDE_Morph.prototype.ucddeletealllibraries = function ()
{
    try {
        var my_libs = IDE_Morph.prototype.ucdgetlibrarieslist();
        var num = 0;
        localStorage['-ucdrobolab-libs-'] = '';
        my_libs.forEach(function (element) {

            try {
                delete localStorage['-ucdrobolab-libs-' + element];
                IDE_Morph.prototype.ucdsetlibrarystat(num++, false);
            }
            catch (err) { }

        });
    } catch (err) { }
}

IDE_Morph.prototype.ucdsetlibrarystat = function (index,stat)
{
    try {
        //alert('i' + index + ' , ' + stat);
        localStorage['-ucdrobolab-libs-stat' + index] = stat?'t':'f';
        //alert('i:' + localStorage['-ucdrobolab-libs-stat' + index]);
    }catch (err){ }
}

IDE_Morph.prototype.ucdgetlibrarystat = function (index) {
    try {
        if (typeof localStorage['-ucdrobolab-libs-stat' + index] != 'undefined') {            
            return localStorage['-ucdrobolab-libs-stat' + index]=='t';
        }
        else {
            localStorage['-ucdrobolab-libs-stat' + index] = 'f';
            return false;
        }
    } catch (err) { return false; }
}

var _interval=0,intervalreach=false;
IDE_Morph.prototype.start3drobolab = function () {
    
	//alert('basladim');
	
    IDE_Morph.prototype.add3drobomenu();    
    try {		
	    setInterval(function(){				
			function isEmpty(value) {
				return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
			}
			if(!intervalreach)
				_interval++;
			if(_interval==2)
			{
				IDE_Morph.prototype.myself.showMessage('Importing Blocks...', 1);
			}
			if(_interval==3)
			{
				for (var i = 0; i < IDE_Morph.prototype.ucdgetlibrarieslist().length; i++) {
				if (!isEmpty(IDE_Morph.prototype.ucdgetlibrarieslist()[i])) {
					//alert(IDE_Morph.prototype.ucdgetlibrarystat(i) + ' :emre: ' + i);
						if (IDE_Morph.prototype.ucdgetlibrarystat(i)) {
							//    IDE_Morph.prototype.ucdlib[i] = IDE_Morph.prototype.ucdgetlibrarystat(i);
							IDE_Morph.prototype.ucdgetLibrary(IDE_Morph.prototype.ucdgetlibrarieslist()[i]);
						}
					}
					else 
					break;
				}
				interval++;
				intervalreach=true;
			}	
			},500);
	
		}
		catch (err) { alert("emre: "+err); }
};
