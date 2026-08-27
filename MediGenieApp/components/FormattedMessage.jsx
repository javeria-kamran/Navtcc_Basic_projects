import React from 'react';
import { Text, StyleSheet } from 'react-native';

const formatBotMessage = (text) => {
  if (!text) return '';
  
  // Remove markdown headers (###, ##, #)
  let formattedText = text.replace(/^#{1,3}\s+/gm, '');
  
  // Convert **bold** to styled bold
  // We'll use regex to find bold text and wrap it
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // Remove other markdown
  formattedText = formattedText.replace(/`{3}[\s\S]*?`{3}/g, ''); // Remove code blocks
  formattedText = formattedText.replace(/`([^`]+)`/g, '$1'); // Remove inline code
  formattedText = formattedText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links
  
  return formattedText;
};

// Component to render formatted text with bold styling
export const FormattedMessage = ({ text, isBot = false }) => {
  if (!text) return null;
  
  const formattedText = isBot ? formatBotMessage(text) : text;
  
  // Split text by ** to identify bold parts
  const parts = formattedText.split(/(\*\*.*?\*\*)/g);
  
  return (
    <Text style={styles.messageText}>
      {parts.map((part, index) => {
        // Check if part is bold (still has ** after formatBotMessage)
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          return (
            <Text key={index} style={styles.boldText}>
              {boldText}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e8e8e8',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
});