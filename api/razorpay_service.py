import razorpay
from config import settings
from typing import Dict, Any, Optional
from datetime import datetime


class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.razorpay_key_id, settings.razorpay_key_secret)
        )

    def create_order(
        self,
        amount: float,
        currency: str = "INR",
        receipt: str = None,
        notes: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Create a Razorpay order"""
        try:
            order_data = {
                "amount": int(amount * 100),  # Amount in paise
                "currency": currency,
                "receipt": receipt or f"order_{datetime.now().timestamp()}",
                "notes": notes or {}
            }
            order = self.client.order.create(data=order_data)
            return order
        except Exception as e:
            raise Exception(f"Failed to create order: {str(e)}")

    def verify_payment(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str
    ) -> bool:
        """Verify Razorpay payment signature"""
        try:
            self.client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            return True
        except Exception as e:
            raise Exception(f"Payment verification failed: {str(e)}")

    def fetch_payment(self, payment_id: str) -> Dict[str, Any]:
        """Fetch payment details"""
        try:
            payment = self.client.payment.fetch(payment_id)
            return payment
        except Exception as e:
            raise Exception(f"Failed to fetch payment: {str(e)}")

    def refund_payment(
        self,
        payment_id: str,
        amount: Optional[float] = None,
        notes: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Refund a payment"""
        try:
            refund_data = {
                "notes": notes or {}
            }
            if amount:
                refund_data["amount"] = int(amount * 100)
            
            refund = self.client.payment.refund(payment_id, refund_data)
            return refund
        except Exception as e:
            raise Exception(f"Failed to refund payment: {str(e)}")

    def create_subscription(
        self,
        plan_id: str,
        customer_notify: int = 1,
        quantity: int = 1,
        notes: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Create a subscription"""
        try:
            subscription_data = {
                "plan_id": plan_id,
                "customer_notify": customer_notify,
                "quantity": quantity,
                "notes": notes or {}
            }
            subscription = self.client.subscription.create(data=subscription_data)
            return subscription
        except Exception as e:
            raise Exception(f"Failed to create subscription: {str(e)}")


razorpay_service = RazorpayService()
