import React, { FC, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

interface EditContentFormProps {
    originalContent: string;
    onEditSubmit: (newContent: string) => void;
    onEditCancel: () => void;
}

const EditContentForm: FC<EditContentFormProps> = ({ originalContent, onEditSubmit, onEditCancel }) => {
    const [editedContent, setEditContent] = useState(originalContent);

    const handleEditSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        onEditSubmit(editedContent);
    };

    return (
        <>
            <Form onSubmit={handleEditSubmit}>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={editedContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Submit Edit</Button>
                <Button variant="secondary" onClick={() => onEditCancel()}>Cancel</Button>
            </Form>
        </>
    );
};

export default EditContentForm;