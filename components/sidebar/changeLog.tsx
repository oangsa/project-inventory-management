import { Modal, Button, ModalHeader, ModalFooter, ModalBody, useDisclosure, ModalContent } from "@nextui-org/react";
import { SidebarItem } from "./sidebar-render-items";
import { FaClockRotateLeft } from "react-icons/fa6";

export default function ChangeLog() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <div>
            <SidebarItem isClick={() => onOpen()} title="Changelog" icon={<FaClockRotateLeft className="fill-default-400" size={24}/>} setCollapsed={() => {}} />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <span id="modal-title" className="text-lg">
                                    Version: Beta 1.6
                                </span>
                            </ModalHeader>
                            <ModalBody>
                                <span>
                                    ⌛ Lastest Update: Sun 15 Dec 2024.
                                </span>
                                <span>
                                    - Beta 1.6: Bugs Fixed.
                                </span>
                                <span></span>
                                <span>
                                    📦 Features:
                                </span>
                                <span>
                                    - No one gonna add a new feature one night before presentation.
                                </span>
                                <span>
                                    🐞 Bugs Fixed:
                                </span>
                                <span>
                                    - Fixed Unable create a new branch.
                                </span>
                                <span>
                                    - Fixed Password Validation during users creation and update.
                                </span>
                                <span className="text-orange-500">
                                    - We Love KMUTT. 🧡
                                </span>
                            </ModalBody>
                            <ModalFooter>
                                <span className="text-xs">
                                    Developed With ❤️ By: D04 Team.
                                </span>
                            </ModalFooter>
                            <ModalFooter>
                                <Button onPress={() => onClose()} color="danger">
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
