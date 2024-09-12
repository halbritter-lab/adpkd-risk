// src/mixins/TextMixin.js
export default {
    data() {
      return {
        disclaimerSections: [
          {
            title: "Important Information",
            content: "The ADPKD Risk Calculator is intended for educational and research purposes only. It is not a substitute for professional medical advice and should not be used for clinical decision-making."
          },
          {
            title: "Usage Guidelines",
            content: "The results provided by this tool should not be used as a basis for diagnosis or treatment without consulting a healthcare professional."
          }
        ],
        faqContent: [
          {
            question: "What does the Mayo score represent?",
            answer: "The Mayo score is used to classify the severity of ADPKD based on kidney volume adjusted for age and height."
          },
          {
            question: "What is the PROPKD score?",
            answer: "The PROPKD score evaluates the genetic and clinical risk factors for disease progression in ADPKD patients."
          },
          {
            question: "How do I interpret the risk categories?",
            answer: "The combined risk categories use both the Mayo and PROPKD scores to stratify patients into low, intermediate, and high-risk groups."
          },
          {
            question: "Can I use this tool for clinical decision-making?",
            answer: "No, the ADPKD Risk Calculator is intended for educational and research purposes only and should not be used for clinical decision-making."
          }
        ]
      };
    }
  };
  