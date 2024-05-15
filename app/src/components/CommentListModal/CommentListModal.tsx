import { CommentDTO } from "@/dtos/CommentDTO";
import CommentCard from "../CommentCard";
import {
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ScrollView,
  Text,
} from "@gluestack-ui/themed";
import { ModalContent } from "@gluestack-ui/themed";
import { X } from "phosphor-react-native";
import React from "react";
import { ModalBackdrop } from "@gluestack-ui/themed";
import { Divider } from "@gluestack-ui/themed";

type CommentListModalProps = {
  showModal: boolean;
  comments: CommentDTO[];
  closeModal: () => void;
};

const CommentListModal: React.FC<CommentListModalProps> = ({
  comments,
  showModal,
  closeModal,
}) => {
  const ref = React.useRef(null);

  return (
    <Modal isOpen={showModal} onClose={closeModal} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent maxHeight={"$96"}>
        <ModalHeader>
          <Heading size="lg">Comentários</Heading>
          <ModalCloseButton>
            <Icon as={X} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Divider borderBottomWidth="$1" borderColor="$trueGray800" />

          <ScrollView>
            {/* {comments.length === 0 || !comments ? (
              <Text my="$2" size="md">
                Nenhum comentário
              </Text>
            ) : (
              comments.map((comment) => (
                <CommentCard
                  key={comment.commentId}
                  name={comment.userName}
                  text={comment.comment}
                  date={comment.commentDate}
                />
              ))
            )} */}
          </ScrollView>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CommentListModal;
