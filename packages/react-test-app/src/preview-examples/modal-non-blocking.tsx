/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  IxButton,
  IxModalContent,
  IxModalFooter,
  IxModalHeader,
  IxTypography,
  Modal,
  ModalRef,
  showModal,
} from '@siemens/ix-react';
import { useRef } from 'react';

function CustomModal() {
  const modalRef = useRef<ModalRef>(null);

  const close = () => {
    modalRef.current?.close('close payload!');
  };
  const dismiss = () => {
    modalRef.current?.dismiss('dismiss payload');
  };

  return (
    <Modal ref={modalRef} isNonBlocking disableEscapeClose={false}>
      <IxModalHeader onCloseClick={() => dismiss()}>
        Non-blocking headline
      </IxModalHeader>
      <IxModalContent>
        Page behind stays interactive. Use Cancel, OK, or the close icon.
      </IxModalContent>
      <IxModalFooter>
        <IxButton variant="subtle-primary" onClick={() => dismiss()}>
          Cancel
        </IxButton>
        <IxButton onClick={() => close()}>OK</IxButton>
      </IxModalFooter>
    </Modal>
  );
}

export default function ModalNonBlockingPreview() {
  async function show() {
    await showModal({
      content: <CustomModal />,
    });
  }

  return (
    <div>
      <div style={{ padding: '1rem' }}>
        <IxTypography format="body" textColor="std">
          Content behind the dialog
        </IxTypography>
        <IxButton id="behind">Behind control</IxButton>
      </div>
      <IxButton onClick={show}>Show non-blocking modal</IxButton>
    </div>
  );
}
