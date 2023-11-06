import { FC } from "react";

interface QuoteTextProps{
    text: string;
}

const QuoteText: FC<QuoteTextProps> = ({text}) => {
    return (
      <p style={{ fontStyle: 'italic', color: 'grey' }}>
        {text}
      </p>
    );
  };
  
  export default QuoteText;