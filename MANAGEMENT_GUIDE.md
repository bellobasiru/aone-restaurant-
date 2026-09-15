# AONE Restaurant — Everyday Management Guide

No coding needed for anything in this guide. Do everything from your phone
or computer's web browser.

## Logging in

1. Go to `yourwebsite.com/admin/login`.
2. Enter the email and password set up for you (see README section 7 if
   you need to create one).

## Adding a new food item

1. After logging in, tap **Products** in the menu.
2. Fill in the **"Add new product"** form at the top: name, price,
   description, category, and a photo if you have one.
3. Tap **Add product**. It appears on the live website immediately.

## Changing a food price

**Fast way:**
1. Tap **Products**.
2. Find the item in the **"Quick price editing"** table.
3. Type the new price in the "Edit price" box and tap **Save**.

The new price shows on the website right away — customers don't need to
refresh anything special.

## Uploading or replacing a food photo

1. Tap **Products**, find the item in **"All products"**, tap **Edit**.
2. Under "Food image", choose a new photo from your phone or computer.
3. Tap **Save changes**. The old photo is automatically replaced.

## Deleting a food item

1. Tap **Products**, find the item, tap **Delete**.
2. Confirm when asked. This cannot be undone.

## Viewing and confirming orders

1. Tap **Orders**. New orders appear at the top, marked **Pending**.
2. Tap an order to see the full details (items, phone number, address).
3. Use the status dropdown to change it — e.g. **Pending → Confirmed** once
   you've seen the WhatsApp message, then **Preparing**, **Ready**, **Out
   for Delivery**, and finally **Completed**.
4. If an order is a mistake or duplicate, set it to **Cancelled** or tap
   **Delete**.

## Changing the delivery or takeaway fee

1. Tap **Delivery Settings**.
2. Update the fee amounts, or turn delivery/takeaway off entirely with the
   checkboxes.
3. Tap **Save settings**.

## Changing the WhatsApp ordering number

1. Tap **Restaurant Settings**.
2. Update the **WhatsApp ordering number** field.
3. Tap **Save settings**. All future "Checkout on WhatsApp" buttons use the
   new number immediately.

## Changing opening hours, address, or phone numbers

1. Tap **Restaurant Settings**.
2. Update the relevant field(s).
3. Tap **Save settings**.

## Viewing sales

1. Tap **Dashboard** for a quick summary: today's, this week's, and this
   month's sales, plus order counts by status.
2. Tap **Reports** for a day-by-day sales chart and your top-selling items.

## Updating the website after it's already live

Anything in this guide (products, prices, photos, orders, settings) updates
the live site instantly — no redeploying needed.

The only time you'd need a developer's help again is if you want a new
*feature* (a new page, a new kind of button, a different layout) rather
than a content change.

## If something looks wrong

- **Menu is empty:** check your internet connection, then check with
  whoever set up Firebase that the project is still active.
- **Can't log in:** use "Forgot password?" on the login screen, or ask
  whoever manages Firebase to check the Authentication tab.
- **An order didn't arrive on WhatsApp:** check the **Orders** tab in the
  dashboard first — the order is always saved there even if the WhatsApp
  message wasn't sent or received.