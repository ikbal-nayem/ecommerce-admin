import { ReactNode } from 'react';

type ModalBodyProps = {
	children: ReactNode | ReactNode[] | string;
};

const ModalBody = ({ children }: ModalBodyProps) => {
	return <div className='wx__modal__body'>{children}</div>;
};

export default ModalBody;
