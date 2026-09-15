import pandas as pd
import numpy as np

# Same results every time
np.random.seed(42)

# Number of synthetic users
n = 1000

# Generate financial behaviour
monthly_income = np.random.randint(10000, 100000, n)

income_stability = np.random.randint(1, 11, n)

bill_payment_ratio = np.round(np.random.uniform(0.40, 1.00, n), 2)

recharge_regularity = np.random.randint(1, 11, n)

monthly_spending = np.random.randint(5000, 80000, n)

savings_ratio = np.round(
    np.clip(1 - monthly_spending / monthly_income, 0, 0.60), 2
)

transaction_frequency = np.random.randint(5, 150, n)

payment_delay_days = np.random.randint(0, 31, n)

spending_to_income = np.round(
    monthly_spending / monthly_income, 2
)

cashflow_consistency = np.random.randint(1, 11, n)


# Create a simple financial behaviour score
financial_score = (
    income_stability * 5
    + bill_payment_ratio * 30
    + recharge_regularity * 3
    + savings_ratio * 30
    + cashflow_consistency * 3
    - payment_delay_days * 1.5
    - spending_to_income * 20
)


# Convert score into risk bands
def get_risk(score):
    if score >= 70:
        return "LOW"
    elif score >= 45:
        return "MEDIUM"
    else:
        return "HIGH"


risk_band = [get_risk(score) for score in financial_score]


# Create DataFrame
data = pd.DataFrame({
    "monthly_income": monthly_income,
    "income_stability": income_stability,
    "bill_payment_ratio": bill_payment_ratio,
    "recharge_regularity": recharge_regularity,
    "monthly_spending": monthly_spending,
    "savings_ratio": savings_ratio,
    "transaction_frequency": transaction_frequency,
    "payment_delay_days": payment_delay_days,
    "spending_to_income": spending_to_income,
    "cashflow_consistency": cashflow_consistency,
    "risk_band": risk_band
})


# Save dataset
data.to_csv("credit_data.csv", index=False)

print("✅ SCORIFY dataset created successfully!")
print(f"Total users: {len(data)}")
print("\nRisk distribution:")
print(data["risk_band"].value_counts())
print("\nFirst 5 users:")
print(data.head())