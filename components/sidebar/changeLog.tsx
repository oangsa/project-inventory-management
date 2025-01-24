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
                                    ⌛ Lastest Update: Sun 1 Jan 2025.
                                </span>
                                <span>
                                    - Beta 1.7: Bugs Fixed.
                                </span>
                                <span></span>
                                <span>
                                    📦 Features:
                                </span>
                                <span>
                                    - No Features Added.
                                </span>
                                <span>
                                    🐞 Bugs Fixed:
                                </span>
                                <span>
                                    - Fix fetch products bug where it doesn't show the correct data.
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
