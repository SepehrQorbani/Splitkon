<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'amount' => $this->faker->numberBetween(3000, 10000),
            'description' => $this->faker->paragraph,
            'date' => $this->faker->date(),
            'split' => 1,
        ];
    }
}
