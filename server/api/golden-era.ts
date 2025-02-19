import { eq } from 'drizzle-orm';
import { db } from '../db';
import { policies, retiredCustomers } from '@/shared/schema';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function analyzePolicyRequest(customerId: number, message: string, policies: any[]) {
  try {
    const systemPrompt = `You are an expert insurance and retirement planning advisor. 
    Your task is to analyze the customer's profile and policies, then provide personalized recommendations.
    Base your recommendations on:
    - Customer age and health status
    - Existing policies and their performance
    - Risk tolerance
    - Financial goals and concerns
    - Current market conditions
    
    Format your response in a clear, professional manner focusing on actionable insights.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing policy:', error);
    throw new Error('Failed to analyze policy');
  }
}

export async function getCustomerInsights(customer: any) {
  try {
    const prompt = `Analyze this retired customer's profile and provide key insights and product recommendations:
    
    Customer Profile:
    - Name: ${customer.name}
    - Age: ${customer.age}
    - Retirement Year: ${customer.retirementYear}
    - Net Worth: $${customer.netWorth}
    - Health Status: ${customer.healthStatus}
    - Risk Tolerance: ${customer.riskTolerance}
    - Current Policies: ${JSON.stringify(customer.pastPolicies)}
    - Key Concerns: ${customer.concerns.join(', ')}
    
    Provide:
    1. Brief analysis of current portfolio
    2. Gaps in coverage
    3. Top 2-3 product recommendations
    4. Key risks to address`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert retirement planning advisor specializing in insurance and investment products for retirees."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error('Failed to generate customer insights');
  }
}
