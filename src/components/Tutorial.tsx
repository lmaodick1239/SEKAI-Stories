import React, { Dispatch, SetStateAction, useState } from "react";
import Window from "./UI/Window";

interface TutorialProps {
    show: Dispatch<SetStateAction<boolean>>;
}

const Tutorial: React.FC<TutorialProps> = ({ show }) => {
    const [page, setPage] = useState<number>(0);

    return (
        <>
            {page == 0 && (
                <Window
                    show={show}
                    confirmLabel="It's my first time here"
                    confirmFunction={() => {
                        setPage(page + 1);
                    }}
                    skipCloseInConfirm
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            Welcome to SEKAI Stories!
                        </h1>
                        <div className="window__divider">
                            <h2 className="text-center">
                                This window will guide you on how to use this
                                site.
                            </h2>
                            <p className="text-center">
                                If you are familiar with this application, you
                                can close this window.
                            </p>
                            <p className="text-center">
                                You can also open this tutorial at any time on
                                Settings.
                            </p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 1 && (
                <Window
                    show={show}
                    confirmLabel="Next"
                    confirmFunction={() => {
                        setPage(page + 1);
                    }}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            These will navigate you between menus!
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu1.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                    </div>
                </Window>
            )}
            {page == 2 && (
                <Window
                    show={show}
                    confirmLabel="Next"
                    confirmFunction={() => {
                        setPage(page + 1);
                    }}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            <i className="sidebar__select bi bi-card-image"></i>{" "}
                            Background Menu
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu2.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>Select and Upload</h2>
                            <p>
                                Select backgrounds from Project SEKAI or upload
                                your own.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Split Location</h2>
                            <p>
                                You can also do Split Location, showing two in
                                one background.
                            </p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 3 && (
                <Window
                    show={show}
                    confirmLabel="Next"
                    confirmFunction={() => {
                        setPage(page + 1);
                    }}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            <i className="sidebar__select bi bi-chat"></i> Text
                            Menu
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu3.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>Name Tag</h2>
                            <p>
                                This is where you put the names of your
                                character.
                            </p>
                            <h3>Easy Switch</h3>
                            <p>
                                Easy Switch will allow you to switch between two
                                characters without retyping.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Dialogue</h2>
                            <p>
                                This is where you put the dialogue of what the
                                character is speaking.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Scene Text</h2>
                            <p>
                                The time and location of the scene you're
                                making, usually seen at the start of every PJSK
                                story.
                            </p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 4 && (
                <Window
                    show={show}
                    confirmLabel="Next"
                    confirmFunction={() => {
                        setPage(page + 1);
                    }}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            <i className="sidebar__select bi bi-person-fill"></i>{" "}
                            Model & Sprites Menu
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu4.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>Selected Layer</h2>
                            <p>
                                All the models shown on the scene are located
                                here. You can select and do some tweaking.
                            </p>
                            <h3>
                                <i className="bi bi-plus-circle" /> Add Model
                            </h3>
                            <p>
                                You can add a new Live2D model character by
                                clicking the <i className="bi bi-plus-circle" />{" "}
                                button.
                            </p>
                            <h3>
                                <i className="bi bi-upload" /> Upload PNG Sprite
                            </h3>
                            <p>
                                Upload your own PNG sprite by clicking the{" "}
                                <i className="bi bi-upload" /> button.
                            </p>
                            <h3>
                                <i className="bi bi-x-circle" /> Remove Layer
                            </h3>
                            <p>Deletes the selected layer.</p>
                        </div>
                        <div className="window__divider">
                            <h2>Transform</h2>
                            <p>
                                This will allow you to move, change the size,
                                and hide the layer you selected.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Character</h2>
                            <p>
                                If the selected model is a Live2D, you can
                                select characters from the PJSK Cast.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Costume</h2>
                            <p>
                                Once you have selected a character, you can
                                select a costume of your choice.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Emotion</h2>
                            <h3>Pose</h3>
                            <p>Changes the pose of the character selected.</p>
                            <h3>Expression</h3>
                            <p>
                                Changes the facial expression of the character
                                selected.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Mouth</h2>
                            <p>
                                Allows you to change and tweak the opening and
                                shape of the mouth of a Live2D model.
                            </p>
                        </div>
                        <div className="window__divider">
                            <h2>Live2D</h2>
                            <p>
                                You can customize your own poses by tweaking the
                                Live2D parameters and pause the idle animation.
                            </p>
                            <h3>Import/Export</h3>
                            <p>
                                You can also save the adjustments you made and
                                load it to another model.
                            </p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 5 && (
                <Window
                    show={show}
                    confirmLabel="Next"
                    confirmFunction={() => {
                        setPage(page + 1);
                    }}
                    skipCloseInConfirm
                    hideClose
                >
                    <div className="window__content">
                        <h1 className="text-center">
                            Once you're done, save your work!
                        </h1>
                        <div className="window__divider center">
                            <img
                                src="/img/menu5.png"
                                className="outline-blue-4"
                                alt=""
                            />
                        </div>
                        <div className="window__divider">
                            <h2>
                                <i className="bi bi-braces" /> {" "}
                                Import/Export
                            </h2>
                            <p>
                                This will allow you to save and load your entire
                                scene as an editable format.
                            </p>
                        </div>
                    </div>
                </Window>
            )}
            {page == 6 && (
                <Window show={show}>
                    <div className="window__content">
                        <h1 className="text-center">And that's it!</h1>
                        <div className="window__divider center flex-vertical">
                            <p className="text-center">
                                If you wish to repeat this, you can access them
                                back on Settings.
                            </p>
                            <img
                                className="center"
                                src="/img/iine.png"
                                alt=""
                            />
                        </div>
                    </div>
                </Window>
            )}
        </>
    );
};

export default Tutorial;
